// Mock data for development when Supabase connection is not available

export const mockUsers = [
  {
    id: "1",
    email: "elderly@example.com",
    first_name: "Eleanor",
    last_name: "Smith",
    role: "elderly",
    phone: "+1234567890",
    address: "123 Main St, Anytown, USA",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    email: "helper@example.com",
    first_name: "Henry",
    last_name: "Johnson",
    role: "helper",
    phone: "+1987654321",
    address: "456 Oak Ave, Anytown, USA",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    email: "admin@example.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    phone: "+1555555555",
    address: "789 Hub Center, Anytown, USA",
    created_at: new Date().toISOString(),
  },
];

export const mockHelperProfiles = [
  {
    id: "1",
    user_id: "2",
    bio: "Experienced caregiver with 5 years of experience working with elderly clients.",
    services: ["shopping", "medical", "companionship"],
    verification_status: "pending",
    rating: 4.8,
    review_count: 24,
    created_at: new Date().toISOString(),
  },
];

export const mockServiceRequests = [
  {
    id: "1",
    elderly_id: "1",
    service_type: "shopping",
    status: "pending",
    description: "Need help with grocery shopping. List will be provided.",
    scheduled_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    location: "123 Main St, Anytown, USA",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    elderly_id: "1",
    helper_id: "2",
    service_type: "medical",
    status: "assigned",
    description: "Ride to doctor's appointment at City Medical Center",
    scheduled_time: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    location: "123 Main St, Anytown, USA",
    created_at: new Date().toISOString(),
  },
];

export const mockHubs = [
  {
    id: "1",
    name: "Downtown Community Hub",
    address: "100 Center St, Anytown, USA",
    phone: "+1555123456",
    email: "downtown@communityhub.org",
    latitude: 40.7128,
    longitude: -74.006,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Westside Senior Center",
    address: "200 West Ave, Anytown, USA",
    phone: "+1555789012",
    email: "westside@seniorcare.org",
    latitude: 40.73,
    longitude: -74.02,
    created_at: new Date().toISOString(),
  },
];

export const mockEmergencyContacts = [
  {
    id: "1",
    user_id: "1",
    name: "John Smith",
    relationship: "Son",
    phone: "+1555111222",
    email: "john@example.com",
    is_primary: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "1",
    name: "Mary Johnson",
    relationship: "Daughter",
    phone: "+1555333444",
    email: "mary@example.com",
    is_primary: false,
    created_at: new Date().toISOString(),
  },
];
