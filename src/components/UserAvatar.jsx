"use client";
import React from 'react';
import { Avatar } from "@nextui-org/react";
import { generateAvatar } from "@/utils/avatar";

export default function UserAvatar({ user, size = "sm", className = "" }) {
  if (!user) {
    return (
      <Avatar
        src={generateAvatar(null)}
        size={size}
        className={className}
        isBordered
        color="danger"
      />
    );
  }
  
  return (
    <Avatar
      src={user.avatarUrl || generateAvatar(user)}
      size={size}
      className={className}
      isBordered
      color="danger"
      showFallback
      crossOrigin="anonymous"
      loading="eager"
      fallback={
        <div className="bg-red-500/10 flex items-center justify-center w-full h-full text-red-500 font-bold">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
      }
    />
  );
} 