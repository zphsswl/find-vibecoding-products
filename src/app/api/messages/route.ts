import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireCurrentUser } from "@/lib/session";

export async function POST(request: NextRequest) {
  const user = await requireCurrentUser();
  const { receiverUsername, body } = await request.json();

  if (!body || typeof body !== "string" || !body.trim()) {
    return NextResponse.json({ error: "消息不能为空" }, { status: 400 });
  }

  if (!receiverUsername || typeof receiverUsername !== "string") {
    return NextResponse.json({ error: "收件人不能为空" }, { status: 400 });
  }

  if (receiverUsername === user.username) {
    return NextResponse.json({ error: "不能给自己发私信" }, { status: 400 });
  }

  const receiver = await prisma.user.findUnique({ where: { username: receiverUsername } });
  if (!receiver) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      senderId: user.id,
      receiverId: receiver.id,
      body: body.trim()
    }
  });

  return NextResponse.json({ id: message.id });
}

export async function GET(request: NextRequest) {
  const user = await requireCurrentUser();
  const { searchParams } = new URL(request.url);
  const withUser = searchParams.get("with");

  if (withUser) {
    // Get conversation with a specific user
    const other = await prisma.user.findUnique({ where: { username: withUser } });
    if (!other) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id, receiverId: other.id },
          { senderId: other.id, receiverId: user.id }
        ]
      },
      include: {
        sender: { select: { username: true, displayName: true, avatarUrl: true, avatarPreset: true } },
        receiver: { select: { username: true, displayName: true, avatarUrl: true, avatarPreset: true } }
      },
      orderBy: { createdAt: "asc" }
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: { receiverId: user.id, senderId: other.id, read: false },
      data: { read: true }
    });

    return NextResponse.json({ messages, withUser: other });
  }

  // Get list of conversations
  const sentTo = await prisma.message.findMany({
    where: { senderId: user.id },
    select: { receiver: { select: { username: true, displayName: true, avatarUrl: true, avatarPreset: true } } },
    distinct: ["receiverId"],
    orderBy: { createdAt: "desc" }
  });

  const receivedFrom = await prisma.message.findMany({
    where: { receiverId: user.id },
    select: { sender: { select: { username: true, displayName: true, avatarUrl: true, avatarPreset: true } } },
    distinct: ["senderId"],
    orderBy: { createdAt: "desc" }
  });

  // Merge and deduplicate conversations
  const conversationMap = new Map<string, { username: string; displayName: string; avatarUrl: string | null; avatarPreset: string | null }>();
  for (const item of receivedFrom) {
    conversationMap.set(item.sender.username, item.sender);
  }
  for (const item of sentTo) {
    if (!conversationMap.has(item.receiver.username)) {
      conversationMap.set(item.receiver.username, item.receiver);
    }
  }

  const conversations = Array.from(conversationMap.values());

  // Get unread count
  const unreadCount = await prisma.message.count({
    where: { receiverId: user.id, read: false }
  });

  return NextResponse.json({ conversations, unreadCount });
}
