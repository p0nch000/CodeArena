"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";

function getBadgeStyles(badge) {
  switch (badge) {
    case "Elite":
      return {
        backgroundColor: "#DC262633", 
        textColor: "#DC2626", 
      };
    case "Master":
      return {
        backgroundColor: "#A78BFA33", 
        textColor: "#A78BFA", 
      };
    case "Expert":
      return {
        backgroundColor: "#60A5FA33", 
        textColor: "#60A5FA", 
      };
    default:
      return {
        backgroundColor: "#6B728033", 
        textColor: "#6B7280", 
      };
  }
}

const users = [
  {
    id: 1,
    name: "Alex Morgan",
    challenges: 42,
    points: 2150,
    badge: "Elite",
  },
  {
    id: 2,
    name: "Sarah Chen",
    challenges: 38,
    points: 1890,
    badge: "Master",
  },
  {
    id: 3,
    name: "John Doe",
    challenges: 35,
    points: 1760,
    badge: "Expert",
  },
];

export default function Leaderboard() {
  return (
    <div className="w-full">
      <div className="w-full rounded-xl overflow-hidden shadow-md border border-zinc-800 bg-mahindra-dark-blue">
        <Table
          isStriped
          removeWrapper
          aria-label="Leaderboard table"
          classNames={{
            table: "bg-mahindra-dark-blue text-white",
            th: "text-xs font-bold text-zinc-300 bg-zinc-800/50 py-5 text-center uppercase tracking-wider",
            td: "text-sm text-mahindra-light-gray py-4 text-center",
            tr: "border-b border-zinc-800/30 transition-colors",
          }}
        >
          <TableHeader>
            <TableColumn>Rank</TableColumn>
            <TableColumn>User</TableColumn>
            <TableColumn>Challenges</TableColumn>
            <TableColumn>Points</TableColumn>
            <TableColumn>Badge</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user, idx) => {
              const { backgroundColor, textColor } = getBadgeStyles(user.badge);

              return (
                <TableRow 
                  key={user.id} 
                  className="group cursor-pointer"
                >
                  <TableCell className="text-red-400 font-semibold group-hover:bg-red-500/10">#{idx + 1}</TableCell>
                  <TableCell className="text-mahindra-white font-medium group-hover:bg-red-500/10">{user.name}</TableCell>
                  <TableCell className="group-hover:bg-red-500/10">{user.challenges}</TableCell>
                  <TableCell className="group-hover:bg-red-500/10">{user.points.toLocaleString()}</TableCell>
                  <TableCell className="group-hover:bg-red-500/10">
                    <div className="flex justify-center">
                      <Chip
                        variant="shadow"
                        size="sm"
                        classNames={{
                          base: "px-3 py-1.5",
                          content: "font-semibold tracking-wide",
                        }}
                        style={{
                          backgroundColor,
                          color: textColor,
                          fontWeight: 600,
                          fontSize: "0.75rem",
                          borderRadius: "9999px",
                        }}
                      >
                        {user.badge}
                      </Chip>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
