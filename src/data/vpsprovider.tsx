export interface Computer {
    id: string;
    name: string;
    location: string;
    ip: string;
    username: string;
    password: string;
    status: string;
    notes: string;
    plan: string;
  }
  
  export const fakeData: Computer[] = [
    {
      id: "1",
      name: "VPS-001",
      location: "Hà Nội",
      ip: "192.168.1.1",
      username: "admin",
      password: "password123",
      status: "REQUEST",
      notes: "Yêu cầu mới",
      plan: "SMALL",
    },
    {
      id: "2",
      name: "VPS-002",
      location: "TP. HCM",
      ip: "192.168.1.2",
      username: "root",
      password: "securePass",
      status: "PAID",
      notes: "Đã thanh toán, chờ xử lý",
      plan: "MEDIUM",
    },
    {
      id: "3",
      name: "VPS-003",
      location: "Hà Nội",
      ip: "192.168.1.3",
      username: "user",
      password: "userPass",
      status: "COMPLETED",
      notes: "Hoàn thành",
      plan: "LARGE",
    },
  ];
  