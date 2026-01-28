// Mock users for development/testing
export const mockUsers = [
  {
    id: "M001",
    email: "samuel@lifereach.org",
    password: "password123",
    firstName: "Samuel",
    lastName: "Mwewa",
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
  },
  {
    id: "M002",
    email: "grace@lifereach.org",
    password: "password123",
    firstName: "Grace",
    lastName: "Banda",
    phone: "+260 97 234 5678",
    dateOfBirth: "1992-08-22",
    address: "Woodlands, Lusaka",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    cell: {
      name: "Women of Faith",
      location: "Woodlands Cell",
      leader: "Pastor Sarah",
      meetingDay: "Thursday",
      meetingTime: "18:00",
      meetingVenue: "Woodlands Community Hall"
    },
    memberSince: "2022-03-10",
    emergencyContact: {
      name: "John Banda",
      phone: "+260 97 876 5432",
      relationship: "Husband"
    },
    bio: "Worship leader and intercessor. Passionate about prayer ministry.",
    ministries: ["Worship Team", "Intercession", "Women's Ministry"],
    growthTrack: {
      track1: true,
      track2: true,
      leadership: true
    }
  },
  {
    id: "M003",
    email: "john@lifereach.org",
    password: "password123",
    firstName: "John",
    lastName: "Phiri",
    phone: "+260 97 345 6789",
    dateOfBirth: "1988-12-05",
    address: "Kabulonga, Lusaka",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    cell: {
      name: "Champions Cell",
      location: "Kabulonga Cell",
      leader: "Elder Mike",
      meetingDay: "Friday",
      meetingTime: "19:00",
      meetingVenue: "Champions House"
    },
    memberSince: "2021-06-20",
    emergencyContact: {
      name: "Mary Phiri",
      phone: "+260 97 987 6543",
      relationship: "Wife"
    },
    bio: "Cell leader and mentor. Love teaching God's word.",
    ministries: ["Cell Leader", "Teaching Team", "Men's Ministry"],
    growthTrack: {
      track1: true,
      track2: true,
      leadership: true
    }
  },
  {
    id: "M004",
    email: "test@test.com",
    password: "test123",
    firstName: "Test",
    lastName: "User",
    phone: "+260 97 000 0000",
    dateOfBirth: "2000-01-01",
    address: "Test Location, Lusaka",
    profileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400",
    cell: {
      name: "Test Cell",
      location: "Test Location",
      leader: "Test Leader",
      meetingDay: "Sunday",
      meetingTime: "10:00",
      meetingVenue: "Test Venue"
    },
    memberSince: "2024-01-01",
    emergencyContact: {
      name: "Test Contact",
      phone: "+260 97 111 1111",
      relationship: "Friend"
    },
    bio: "Test user account for development.",
    ministries: ["Testing"],
    growthTrack: {
      track1: false,
      track2: false,
      leadership: false
    }
  }
];

// Helper function to find user by email and password
export const authenticateUser = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  return user || null;
};
