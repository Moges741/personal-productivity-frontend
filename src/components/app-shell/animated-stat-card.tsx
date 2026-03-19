"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AnimatedStatCard({ title, value }: { title: string; value: string }) {
  return (
    <motion.div whileHover={{ scale: 1.01, y: -2 }} transition={{ duration: 0.18 }}>
      <Card className="rounded-2xl border-border/60 bg-background/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}