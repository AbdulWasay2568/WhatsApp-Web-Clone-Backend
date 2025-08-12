export enum CallStatus{
  Ringing =  "Ringing",
  Accepted = "Accepted",
  Rejected = "Rejected",
  Missed = "Missed",
  Ended = "Ended"
}
export interface CreateCallDto {
  callerId: number;
  calleeId: number;
  status: CallStatus;
  startedAt?: Date;
  endedAt?: Date;
}

export interface UpdateCallDto {
  status?: CallStatus;
  startedAt?: Date;
  endedAt?: Date;
}
