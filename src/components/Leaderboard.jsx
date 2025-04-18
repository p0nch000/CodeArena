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

// Función para asignar estilos personalizados a cada badge
function getBadgeStyles(badge) {
  switch (badge) {
    case "Elite":
      return {
        backgroundColor: "#DC262633", // rojo intenso
        textColor: "#DC2626", // rojo claro
      };
    case "Master":
      return {
        backgroundColor: "#A78BFA33", // morado
        textColor: "#A78BFA", // morado claro
      };
    case "Expert":
      return {
        backgroundColor: "#60A5FA33", // azul
        textColor: "#60A5FA", // azul claro
      };
    default:
      return {
        backgroundColor: "#6B728033", // gris neutro
        textColor: "#6B7280", // gris claro
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
    <div className="px-20 sm:px-10 lg:px-20 py-6">
      <div className="w-full rounded-xl shadow-md border border-zinc-800 overflow-hidden">
        <Table
          isStriped
          removeWrapper
          aria-label="Leaderboard table"
          classNames={{
            table: "bg-zinc-900 text-white",
            th: "text-xs font-bold text-zinc-400 bg-zinc-800",
            td: "text-sm text-zinc-300",
            tr: "hover:bg-zinc-800 transition-colors",
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
                <TableRow key={user.id}>
                  <TableCell className="text-red-400 font-semibold">#{idx + 1}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.challenges}</TableCell>
                  <TableCell>{user.points.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      variant="shadow"
                      size="sm"
                      style={{
                        backgroundColor,
                        color: textColor,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    >
                      {user.badge}
                    </Chip>
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
