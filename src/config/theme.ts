import { ThemeConfig } from '../types';

export const THEME: ThemeConfig = {
  personName: "Ambreen",
  birthdayAge: "21",
  passcode: "2005", // 4-digit passcode, easily changeable
  passcodeHint: "Hint: Enter your birth year",

  // Look inside src/config/theme.ts at lines 9-12:
  musicUrl: "https://www.youtube.com/watch?v=Ic458P8NMew&list=RDIc458P8NMew&start_radio=1",
  musicTitle: "Until I Found You",
  artistName: "Stephen Sanchez",

  colors: {
    primary: "#f59e0b",   // Sunflower amber yellow
    secondary: "#f43f5e", // Soft romantic rose
    accent: "#10b981",    // Fresh leaf green
    bgSoft: "#faf7f2",    // Warm Japanese cream paper
    textDark: "#332e2b",  // Warm espresso charcoal
    cardBg: "rgba(255, 255, 255, 0.8)",
  },

  messages: {
    passcodeWelcome: "A Special Secret Surprise for Someone Extraordinary...",
    heroHeading: "Happy Birthday, Ambreen!",
    heroSubtitle: "May your day bloom with endless sunshine, quiet joy, and magical moments.",
    loveLetterTitle: "To My Dearest Sunflower",
    loveLetterText: [
     "Dear Ambreen,",
     "Happy Birthday! 🌻",
     "Some people have a special way of making life brighter simply by being themselves, and you're definitely one of them.",
     "Your kindness, patience, and positive energy inspire everyone around you. I'm truly grateful for the friendship we've built and all the memories we've shared together.",
     "May this new chapter of your life bring you happiness, success, peace, and countless reasons to smile. I hope every dream you're working toward comes true.",
     "Thank you for being such a wonderful friend. Here's to many more happy memories, endless laughter, and beautiful moments ahead.",
     "Have the most amazing birthday—you deserve it! 💛",
     "With best wishes,",
     "Your Friend 🌻"
    ],
    cakeWishPrompt: "Blow out the candles or click to make a wish!",
    defaultWish: "May all your dreams come true, your heart stay full of love, and your year ahead be blessed with pure happiness! ✨🌻",
    endingHeading: "You are Loved Beyond Words",
    endingMessage: "Thank you for being the sweetest part of my life. Happy Birthday again, my sunflower! 💖✨"
  },

  photos: [
  {
    id: "p1",
    url: "https://litti-chokhaaa.github.io/birthday-website/images/image-1.jpeg",
    caption: "A smile that makes every day brighter ✨",
    tag: "Smile",
  },
  {
    id: "p2",
    url: "https://litti-chokhaaa.github.io/birthday-website/images/image-2.jpg",
    caption: "Elegance wrapped in sunshine 🌸",
    tag: "Sunset",
  },
  {
    id: "p3",
    url: "https://litti-chokhaaa.github.io/birthday-website/images/image-3.jpg",
    caption: "Happiness looks beautiful on you 💖",
    tag: "Joy",
  },
  {
    id: "p4",
    url: "https://litti-chokhaaa.github.io/birthday-website/images/image-4.jpg",
    caption: "Blooming with grace and confidence 🌿",
    tag: "Adventure",
  },
  {
    id: "p5",
    url: "https://litti-chokhaaa.github.io/birthday-website/images/image-5.jpg",
    caption: "Lost in dreams, glowing with grace 🌙",
    tag: "Sparkle",
  },
  {
    id: "p6",
    url: "https://litti-chokhaaa.github.io/birthday-website/images/image-6.jpg",
    caption: "Royal by heart, graceful by nature 👑",
    tag: "Love",
  },
  {
    id: "p7",
    url: "https://litti-chokhaaa.github.io/birthday-website/images/image-7.jpg",
    caption: "Shining brighter with every moment ✨",
    tag: "Sparkle",
  },
  {
    id: "p8",
    url: "https://litti-chokhaaa.github.io/birthday-website/images/image-8.jpg",
    caption: "Walking through life with confidence 🌷",
    tag: "Sparkle",
  },
  {
    id: "p9",
    url: "https://litti-chokhaaa.github.io/birthday-website/images/image-9.jpg",
    caption: "Grace captured in a single frame. 🌸",
    tag: "Sparkle",
  }
],

  reasons: [
    {
      id: 1,
      title: "Your Kind Heart 💛",
      description: "You always care about the people around you and make everyone feel valued and appreciated.",
      likes: 124
    },

    {
      id: 2,
      title: "Your Bright Smile 😊",
      description: "Your smile has a way of making every room feel a little happier and brighter.",
      likes: 98
    },

    {
      id: 3,
      title: "Your Determination 🌟",
      description: "No matter what challenges come your way, you face them with courage, patience, and confidence.",
      likes: 110
    },

    { 
      id: 4,
      title: "Your Love for Sunflowers 🌻",
      description: "The happiness on your face whenever you see sunflowers is truly contagious.",
      likes: 142
    },

    {
      id: 5,
      title: "Your Positive Energy ✨",
      description: "Your cheerful personality and good vibes make every moment more enjoyable.",
      likes: 89
    },

    {
      id: 6,
      title: "Simply Being You 🎂",
      description: "Your kindness, laughter, and genuine personality are what make you such a wonderful friend. Never stop being yourself!",
      likes: 156
    }
    
  ],

  timeline: [
    {
      id: "t1",
      date: "August 8, 2005",
      title: "A Beautiful Beginning 🌻",
      description: "On 8th August 2006, a beautiful soul began her journey. A little bundle of joy who would one day brighten the lives of everyone around her.",
      badge: "🌸 Childhood Bloom",
      image: "https://images.openai.com/static-rsc-4/-Br4U2FWLZ7FlPZrXxcr-VALJvxMboLqRMHIr1wFLakePCTtTnCJCSSILIjofLouOLCKa7tTjYgUeEYPadZwaq7r6Ev3Nyyr33VbrfiIzK0JWsM_gQtjJ_NvnMBVbHoBHd0QE-jyBHCMe7qHiXmF0dH4W6ZC7UlcX3_OO23quC6VNr74Cj1CXTjqb3Dv4nHr?purpose=fullsize"
    },
    {
      id: "t2",
      date: "2006 – 2015",
      title: "Growing with Smiles 🌸",
      description: "Childhood was filled with curiosity, laughter, school days, new friendships, and countless little moments that shaped a kind and wonderful person.",
      badge: "🌼 Blooming Years",
      image: "https://images.openai.com/static-rsc-4/2ChObnxyNsODwzptxefVB6VI7eAh3kkxiKmD_jqw_wgCFctIXcqgSy-RG5OcorGh4Uxi0no60QZjxPt0TThBMC9EYEwYkVTJZWosIIsXmZqHhXg4sOWK0HP2mqRtFztKc-UKf0z6u67408HT0OVwW3QjgJMZ8axy862ZfKfoVWpAhSQwoY1snDPmRlIMx--m?purpose=fullsize"
    },
    {
      id: "t3",
      date: "2016 – 2025",
      title: "Dreams & New Adventures ✨",
      description: "As the years passed, every experience became a stepping stone toward growth, confidence, and unforgettable memories. Each chapter added something beautiful to her story.",
      badge: "🌈 New Adventures",
      image: "https://images.openai.com/static-rsc-4/lld06TyeyFJJ3j3PdpJv6LCc5icAtAgfCw5oqvKZav2rWpUIbxZ_HR_EUPZp1pfLCQKVqkiQavfNm74YSbuCE3F9OcKPUpZGPTmGVjSl73IpwQvaEu8pLHXvE5WdAMbaxND60wZOiHdiK2mG2vg3g4Pt6NjyeeKUTeYwL2wtoKJLSoKsMZHY1CQ0oiJCp2We?purpose=fullsize"
    },
    {
      id: "t4",
      date: "2026",
      title: "Happy 21th Birthday! 🎂",
      description: "Today is a celebration of 21 amazing years. May this new chapter bring endless happiness, success, good health, beautiful memories, and all the dreams your heart wishes for. Keep smiling and shining like the sunflower you are. 🌻💛",
      badge: "🎂 A New Chapter Begins",
      image: "https://images.openai.com/static-rsc-4/iZsRySu0Q6EB8rkMiCZTai61vguMkn8c_0WnMvqUeY0nunV1uXTtENiPgQ7767hPhJJ0JR2TXXRJTILd6WQPJ0JvIxYpOh5no_i_NZrLwedkfsvL1eHSenT2vqx21FmBcJfliYR59Nq5l1rmBuMd1Cmx9x22ZElHAwdaPJg8SCqbeEqT1phvq504VjLkB_nN?purpose=fullsize"
    }
  ],

  giftCoupons: [
    {
      id: "c1",
      title: "☕ 1x Coffee Treat",
      description: "One coffee or your favorite drink—my treat whenever you want.",
      code: "COFFEE-TREAT",
      icon: "Sparkles",
      color: "from-amber-100 to-amber-200"
    },
    {
      id: "c2",
      title: "🍦 1x Ice Cream Run",
      description: "Any flavor, any day—just say the word!",
      code: "ICE-CREAM-RUN",
      icon: "Heart",
      color: "from-rose-100 to-rose-200"
    },
    {
      id: "c3",
      title: "1🍕 1x Favorite Meal",
      description: "Let's enjoy your favorite food together.",
      code: "FOOD-TREAT",
      icon: "Gift",
      color: "from-amber-200 to-orange-100"
    },
    {
      id: "c4",
      title: "🎁 1x Birthday Coupon",
      description: "A special surprise chosen just for you. No hints, no spoilers—only smiles when it's finally revealed!",
      code: "MYSTERY-GIFT",
      icon: "Sun",
      color: "from-yellow-100 to-amber-100"
    }
  ],

  sunflower: {
    bloomDurationSec: 4.5,
    rotationSpeed: 0.15,
    centerZoomScale: 8.0,
  }
};

export default THEME;
