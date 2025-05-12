"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

type ContactUsData = {
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
};

const ContactUs = () => {
  const { user } = useClerk();
  const [data, setData] = useState<ContactUsData>({
    name: null,
    email: null,
    phone: null,
    message: null,
  });

  useEffect(() => {
    if (user) {
      if (user.primaryEmailAddress) {
        setData((prev) => ({
          ...prev,
          email: user.primaryEmailAddress?.emailAddress || "",
        }));
      }
      if (user.fullName) {
        setData((prev) => ({
          ...prev,
          name: user.fullName,
        }));
      }
    }
  }, [user]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          className="text-sm flex items-center justify-center gap-2 cursor-pointer hover:text-blue-500"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Send />
          Contact Us
        </motion.div>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-[425px] bg-themebackground">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Please get in touch with us, and we will reach out to you soon
          </DialogDescription>
        </DialogHeader>
        <form action="https://formspree.io/f/mkgwrrwq" method="POST">
          <div className="grid gap-4 pb-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                value={data.name || ""}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                name="username"
                type="text"
                placeholder="Enter your name"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Phone
              </Label>
              <Input
                value={data.phone || ""}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="col-span-3"
                name="phone"
                type="text"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Email
              </Label>
              <Input
                value={data.email || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, email: e.target.value })
                }
                placeholder="Enter your email"
                className="col-span-3"
                type="email"
                name="Email"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Message
              </Label>
              <Input
                value={data.message || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setData({ ...data, message: e.target.value })
                }
                placeholder="How Can We Help You?"
                className="col-span-3"
                name="message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUs;
