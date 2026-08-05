export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date: string;
  tag?: string;
  location?: string;
}

export interface ReasonItem {
  id: number;
  title: string;
  description: string;
  icon?: string;
  likes: number;
}

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  badge?: string;
}

export interface GiftCoupon {
  id: string;
  title: string;
  description: string;
  code: string;
  icon: string;
  color: string;
  unlocked?: boolean;
}

export interface ThemeConfig {
  personName: string;
  birthdayAge?: string;
  passcode: string;
  passcodeHint: string;
  musicUrl: string;
  musicTitle: string;
  artistName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bgSoft: string;
    textDark: string;
    cardBg: string;
  };
  messages: {
    passcodeWelcome: string;
    heroHeading: string;
    heroSubtitle: string;
    loveLetterTitle: string;
    loveLetterText: string[];
    cakeWishPrompt: string;
    defaultWish: string;
    endingHeading: string;
    endingMessage: string;
  };
  photos: PhotoItem[];
  reasons: ReasonItem[];
  timeline: TimelineItem[];
  giftCoupons: GiftCoupon[];
  sunflower: {
    bloomDurationSec: number;
    rotationSpeed: number;
    centerZoomScale: number;
  };
}
