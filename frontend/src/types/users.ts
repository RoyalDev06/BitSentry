export interface PlatformUser {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  roles: string[];
}

export interface CreatePlatformUserRequest {
  email: string;
  full_name: string;
  password: string;
  role: 'admin' | 'analyst';
}
