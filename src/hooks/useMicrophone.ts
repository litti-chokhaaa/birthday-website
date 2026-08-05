import { useState, useEffect, useCallback, useRef } from 'react';

export function useMicrophoneBlowDetection(onBlowDetected: () => void, isListeningActive: boolean = false) {
  const [hasMicPermission, setHasMicPermission] = useState<boolean | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [blowVolume, setBlowVolume] = useState<number>(0);
  const [micError, setMicError] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const onBlowRef = useRef(onBlowDetected);

  useEffect(() => {
    onBlowRef.current = onBlowDetected;
  }, [onBlowDetected]);

  const stopListening = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // ignore
      }
      audioCtxRef.current = null;
    }
    setIsListening(false);
    setBlowVolume(0);
  }, []);

  const startListening = useCallback(async () => {
    // Stop any existing stream first
    stopListening();
    setMicError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasMicPermission(false);
        setMicError('Microphone API not supported on this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: true,
        },
        video: false,
      });

      streamRef.current = stream;
      setHasMicPermission(true);

      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      audioCtxRef.current = audioCtx;

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      setIsListening(true);

      let blowStreak = 0;

      const checkVolume = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;

        analyser.getByteFrequencyData(dataArray);

        // Low-frequency bins (0..15) represent wind / air turbulence when blowing into mic
        let lowSum = 0;
        for (let i = 0; i < 15; i++) {
          lowSum += dataArray[i];
        }
        const lowAverage = lowSum / 15;

        // Overall volume average
        let totalSum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          totalSum += dataArray[i];
        }
        const totalAverage = totalSum / dataArray.length;

        // Combine low freq (blow turbulence) and total volume for higher sensitivity
        const blowMetric = Math.max(lowAverage, totalAverage * 1.3);
        const normalized = Math.min(100, Math.round((blowMetric / 180) * 100));

        setBlowVolume(normalized);

        // Responsive threshold for blowing (value around 20+)
        if (normalized > 20) {
          blowStreak++;
          if (blowStreak >= 2) {
            onBlowRef.current();
            stopListening();
            return;
          }
        } else {
          blowStreak = Math.max(0, blowStreak - 1);
        }

        animFrameRef.current = requestAnimationFrame(checkVolume);
      };

      checkVolume();
    } catch (err: unknown) {
      console.warn('Microphone permission error:', err);
      setHasMicPermission(false);
      setMicError('Microphone permission denied or unavailable.');
      setIsListening(false);
    }
  }, [stopListening]);

  useEffect(() => {
    if (isListeningActive) {
      startListening();
    } else {
      stopListening();
    }
    return () => {
      stopListening();
    };
  }, [isListeningActive, startListening, stopListening]);

  return {
    hasMicPermission,
    isListening,
    blowVolume,
    micError,
    startListening,
    stopListening,
  };
}

