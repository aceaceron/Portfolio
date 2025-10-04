export interface Message {
  id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
  reply_to_message_id?: string;
  reply_count?: number;
  users?: {
    image?: string | null;
    is_author?: boolean | null;
  } | null; // Add | null here
  parentMessage?: Message | null | undefined;
}
