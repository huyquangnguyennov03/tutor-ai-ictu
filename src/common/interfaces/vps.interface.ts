import type { ComputerStatus } from "../constants/status"

export interface VpsConfiguration {
  id: string
  name: string
  region: string  
  ipAddress: string 
  username: string
  password: string
  status: ComputerStatus
  note: string
  vpsType: VpsType
  vpsTypeId: string
  activeAt: string | null
  expiredAt: string | null
}

export interface VpsType {
  id: string
  maxDevices: number
  name: string
  price: number
}
