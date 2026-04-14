import EditUserClient from "./EditUserClient";
import SummaryApi, { baseURL } from "@/app/constants/SummaryApi";

type UserListItem = {
  id?: string;
  _id?: string;
};

type UsersListResponse = {
  success: boolean;
  users?: UserListItem[];
  data?: UserListItem[];
};

export async function generateStaticParams() {
  try {
    const endpoint = SummaryApi.users;

    const res = await fetch(`${baseURL}${endpoint.url}`, {
      method: endpoint.method,
      cache: "force-cache",
    });

    if (!res.ok) return [];

    const json: UsersListResponse = await res.json();
    const items = json.users || json.data || [];

    return items
      .map((user) => ({
        id: user.id || user._id || "",
      }))
      .filter((item) => item.id);
  } catch {
    return [];
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditUserClient id={id} />;
}