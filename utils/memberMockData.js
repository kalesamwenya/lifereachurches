// Mock data for member portal

export const memberData = {
  id: "M001",
  firstName: "Samuel",
  lastName: "Mwewa",
  email: "samuel.mwewa@lifereach.org",
  phone: "+260 97 123 4567",
  dateOfBirth: "1995-03-15",
  address: "Manda Hill Area, Lusaka",
  profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400",
  cell: {
    name: "Apex Youth",
    location: "Manda Hill Cell",
    leader: "Deacon Mike Tembo",
    meetingDay: "Wednesday",
    meetingTime: "18:00",
    meetingVenue: "Manda Hill Community Center"
  },
  memberSince: "2023-01-15",
  emergencyContact: {
    name: "Jane Mwewa",
    phone: "+260 97 765 4321",
    relationship: "Sister"
  },
  bio: "Passionate about youth ministry and worship. Serving in the media team.",
  ministries: ["Media Team", "Youth Ministry", "Worship Team"],
  growthTrack: {
    track1: true,
    track2: true,
    leadership: false
  }
};

export const sermonsData = [
  {
    id: 1,
    title: "The Warrior Within",
    date: "2026-01-21",
    speaker: "Prophet Gomezyo",
    duration: "45:32",
    thumbnail: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400",
    videoUrl: "https://example.com/sermon1.mp4",
    audioUrl: "https://example.com/sermon1.mp3",
    series: "Warrior Series",
    description: "A powerful message about discovering the warrior spirit within every believer and standing firm in spiritual battles.",
    scripture: "Ephesians 6:10-18",
    hasReview: true,
    reviewDate: "2026-01-22",
    rating: 5,
    notes: "Powerful message about spiritual warfare and standing firm in faith. The illustration about David facing Goliath was particularly impactful."
  },
  {
    id: 2,
    title: "Faith in the Fire",
    date: "2026-01-14",
    speaker: "Pastor John Banda",
    duration: "52:18",
    thumbnail: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400",
    videoUrl: "https://example.com/sermon2.mp4",
    audioUrl: "https://example.com/sermon2.mp3",
    series: "Faith Series",
    description: "Learning to maintain unwavering faith even in the midst of life's fiercest trials.",
    scripture: "Daniel 3:16-18",
    hasReview: true,
    reviewDate: "2026-01-15",
    rating: 5,
    notes: "Inspiring teaching on maintaining faith during trials. The story of Shadrach, Meshach, and Abednego resonated deeply."
  },
  {
    id: 3,
    title: "Kingdom Principles",
    date: "2026-01-07",
    speaker: "Prophet Gomezyo",
    duration: "48:45",
    thumbnail: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400",
    videoUrl: "https://example.com/sermon3.mp4",
    audioUrl: "https://example.com/sermon3.mp3",
    series: "Kingdom Series",
    description: "Understanding the foundational principles that govern God's Kingdom and how to operate in them.",
    scripture: "Matthew 6:33",
    hasReview: false
  },
  {
    id: 4,
    title: "The Power of Worship",
    date: "2025-12-31",
    speaker: "Pastor Grace Mwale",
    duration: "39:22",
    thumbnail: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    videoUrl: "https://example.com/sermon4.mp4",
    audioUrl: "https://example.com/sermon4.mp3",
    series: "Worship Series",
    description: "Discovering how worship unlocks heaven's gates and positions us for divine encounters.",
    scripture: "Psalm 100:4",
    hasReview: true,
    reviewDate: "2026-01-01",
    rating: 4,
    notes: "Beautiful message on entering God's presence through worship. Need to practice more intentional worship."
  },
  {
    id: 5,
    title: "Walking in Purpose",
    date: "2025-12-24",
    speaker: "Prophet Gomezyo",
    duration: "55:10",
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    videoUrl: "https://example.com/sermon5.mp4",
    audioUrl: "https://example.com/sermon5.mp3",
    series: "Purpose Series",
    description: "Finding and fulfilling your God-given purpose in this season of your life.",
    scripture: "Jeremiah 29:11",
    hasReview: false
  },
  {
    id: 6,
    title: "The Authority Believer",
    date: "2025-12-17",
    speaker: "Prophet Gomezyo",
    duration: "50:22",
    thumbnail: "https://images.unsplash.com/photo-1542838686-e2c1bcdf2e32?w=400",
    videoUrl: "https://example.com/sermon6.mp4",
    audioUrl: "https://example.com/sermon6.mp3",
    series: "Authority Series",
    description: "Understanding the authority given to every believer in Christ Jesus.",
    scripture: "Luke 10:19",
    hasReview: false
  }
];

export const booksData = [
  {
    id: 1,
    title: "Understanding Your Potential",
    author: "Dr. Myles Munroe",
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
    isbn: "978-0883689424",
    pages: 224,
    progress: 65,
    status: "reading",
    category: "Leadership",
    startedDate: "2026-01-10",
    description: "A guide to discovering and releasing your hidden potential.",
    keyTakeaways: [
      "Your potential is unlimited",
      "Purpose is the key to potential",
      "God wants you to discover your potential"
    ]
  },
  {
    id: 2,
    title: "The Purpose Driven Life",
    author: "Rick Warren",
    cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
    isbn: "978-0310205715",
    pages: 336,
    progress: 100,
    status: "completed",
    category: "Spiritual Growth",
    startedDate: "2025-12-01",
    completedDate: "2026-01-05",
    description: "A spiritual journey to discover God's purpose for your life.",
    keyTakeaways: [
      "It's not about you",
      "You were planned for God's pleasure",
      "Life is all about love"
    ]
  },
  {
    id: 3,
    title: "Mere Christianity",
    author: "C.S. Lewis",
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
    isbn: "978-0060652920",
    pages: 227,
    progress: 40,
    status: "reading",
    category: "Theology",
    startedDate: "2026-01-15",
    description: "A theological book that forms the basis of Christian belief.",
    keyTakeaways: []
  },
  {
    id: 4,
    title: "The Kingdom Principles",
    author: "Dr. Myles Munroe",
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400",
    isbn: "978-0768423143",
    pages: 288,
    progress: 0,
    status: "wishlist",
    category: "Leadership",
    description: "Preparing for Kingdom experience and expansion."
  },
  {
    id: 5,
    title: "Boundaries",
    author: "Dr. Henry Cloud",
    cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
    isbn: "978-0310247456",
    pages: 320,
    progress: 100,
    status: "completed",
    category: "Personal Development",
    startedDate: "2025-11-20",
    completedDate: "2025-12-20",
    description: "When to say yes, how to say no to take control of your life.",
    keyTakeaways: [
      "Boundaries define who we are and who we are not",
      "Setting boundaries is not selfish",
      "Healthy boundaries create healthy relationships"
    ]
  },
  {
    id: 6,
    title: "The Power of Prayer",
    author: "E.M. Bounds",
    cover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400",
    isbn: "978-0883681558",
    pages: 128,
    progress: 25,
    status: "reading",
    category: "Prayer",
    startedDate: "2026-01-20",
    description: "Classic writings on the importance and power of prayer.",
    keyTakeaways: []
  }
];

export const givingHistory = [
  {
    id: 1,
    date: "2026-01-20",
    type: "Tithe",
    amount: 500,
    method: "Mobile Money",
    status: "completed",
    reference: "TXN202601200001",
    receiptUrl: "/receipts/TXN202601200001.pdf"
  },
  {
    id: 2,
    date: "2026-01-13",
    type: "Tithe",
    amount: 500,
    method: "Mobile Money",
    status: "completed",
    reference: "TXN202601130001",
    receiptUrl: "/receipts/TXN202601130001.pdf"
  },
  {
    id: 3,
    date: "2026-01-06",
    type: "Tithe",
    amount: 500,
    method: "Mobile Money",
    status: "completed",
    reference: "TXN202601060001",
    receiptUrl: "/receipts/TXN202601060001.pdf"
  },
  {
    id: 4,
    date: "2025-12-30",
    type: "Tithe",
    amount: 500,
    method: "Cash",
    status: "completed",
    reference: "TXN202512300001",
    receiptUrl: "/receipts/TXN202512300001.pdf"
  },
  {
    id: 5,
    date: "2025-12-25",
    type: "Offering",
    amount: 200,
    method: "Mobile Money",
    status: "completed",
    reference: "TXN202512250001",
    receiptUrl: "/receipts/TXN202512250001.pdf"
  },
  {
    id: 6,
    date: "2025-12-23",
    type: "Tithe",
    amount: 500,
    method: "Mobile Money",
    status: "completed",
    reference: "TXN202512230001",
    receiptUrl: "/receipts/TXN202512230001.pdf"
  },
  {
    id: 7,
    date: "2025-12-16",
    type: "Tithe",
    amount: 500,
    method: "Mobile Money",
    status: "completed",
    reference: "TXN202512160001",
    receiptUrl: "/receipts/TXN202512160001.pdf"
  },
  {
    id: 8,
    date: "2025-12-09",
    type: "Building Fund",
    amount: 1000,
    method: "Bank Transfer",
    status: "completed",
    reference: "TXN202512090001",
    receiptUrl: "/receipts/TXN202512090001.pdf"
  },
  {
    id: 9,
    date: "2025-12-02",
    type: "Tithe",
    amount: 500,
    method: "Mobile Money",
    status: "completed",
    reference: "TXN202512020001",
    receiptUrl: "/receipts/TXN202512020001.pdf"
  },
  {
    id: 10,
    date: "2025-11-25",
    type: "Tithe",
    amount: 500,
    method: "Mobile Money",
    status: "completed",
    reference: "TXN202511250001",
    receiptUrl: "/receipts/TXN202511250001.pdf"
  }
];

export const eventsData = [
  {
    id: 1,
    title: "Manda Hill Wednesday Fellowship",
    date: "2026-01-28",
    time: "18:00",
    location: "Manda Hill Community Center",
    type: "Cell Meeting",
    host: "Deacon Mike",
    attending: 12,
    focus: "Understanding Identity in Christ",
    description: "Join us for our weekly fellowship as we dive deep into understanding who we are in Christ."
  },
  {
    id: 2,
    title: "Youth Conference 2026",
    date: "2026-02-15",
    time: "09:00",
    location: "Life Reach Main Campus",
    type: "Conference",
    host: "Youth Ministry",
    attending: 156,
    focus: "Ignited Generation",
    description: "A full day conference for young people to encounter God's presence and discover their purpose."
  },
  {
    id: 3,
    title: "Prayer Night",
    date: "2026-02-01",
    time: "20:00",
    location: "Main Sanctuary",
    type: "Prayer",
    host: "Intercession Team",
    attending: 45,
    focus: "Breakthrough Prayer",
    description: "A night of powerful intercession and breakthrough prayers for the nation and church."
  }
];

export const activityData = [
  {
    id: 1,
    type: "sermon_review",
    title: "Reviewed 'The Warrior Within'",
    date: "2026-01-22",
    icon: "PlayCircle",
    color: "blue"
  },
  {
    id: 2,
    type: "giving",
    title: "Gave K500 - Tithe",
    date: "2026-01-20",
    icon: "Heart",
    color: "pink"
  },
  {
    id: 3,
    type: "book_progress",
    title: "Updated book progress - 65%",
    date: "2026-01-18",
    icon: "BookOpen",
    color: "orange"
  },
  {
    id: 4,
    type: "attendance",
    title: "Attended Cell Meeting",
    date: "2026-01-14",
    icon: "Users",
    color: "green"
  }
];

export const notificationsData = [
  {
    id: 1,
    type: "sermon",
    title: "New Sermon Review",
    message: "Prophet Gomezyo posted 'The Warrior Within' notes.",
    date: "2026-01-21",
    read: false,
    link: "/member/sermons"
  },
  {
    id: 2,
    type: "event",
    title: "Cell Meeting Reminder",
    message: "Wednesday fellowship at 18:00 hrs.",
    date: "2026-01-27",
    read: false,
    link: "/member/events"
  },
  {
    id: 3,
    type: "giving",
    title: "Giving Receipt Ready",
    message: "Your January giving receipt is ready for download.",
    date: "2026-01-26",
    read: true,
    link: "/member/giving"
  }
];
