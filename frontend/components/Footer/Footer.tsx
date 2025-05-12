"use client";
import React from "react";
import { motion } from "framer-motion";
import { Label } from "../ui/label";
import Image from "next/image";
import {
  BadgeInfo,
  Bike,
  CreditCard,
  Handshake,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ContactUs from "./_components/ContactUs";

const Footer = () => {
  const router = useRouter();
  return (
    <div id="footer" className="bg-themebackground md:bg-themeforeground w-[97vw] overflow-hidden flex flex-col items-center xl:flex-row xl:items-start">
      <div className="flex flex-col md:flex-row">
        <div className="bg-themeforeground mx-4 mb-2 md:mx-0 md:mb-0 w-[92vw] md:w-[50vw] xl:w-[30vw] gap-3 py-5 flex flex-col items-center shadow-lg md:shadow-none rounded-xl md:rounded-none">
          <motion.div
            className="flex items-center gap-2"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link href="/">
              <Image alt="logo" src="/logo.png" width={50} height={50} />
            </Link>
          </motion.div>
          <motion.p
            className="text-sm px-5 text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            We are manufacturers of soaps, surfactants, personal care products,
            and pet care products. By providing effective and economical
            cleaning solutions for yourself, your home, and your pets, we ensure
            ultimate customer satisfaction.
          </motion.p>
          <div className="flex flex-col items-center gap-2">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Label className="text-md font-zen">{`Let's get social`}</Label>
            </motion.div>
            <div className="w-full">
              <div className="flex gap-3">
                <motion.a
                  href="https://www.instagram.com/neechem_nebula"
                  target="_blank"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    duration: 0.6,
                  }}
                >
                  <Image src="/footer/ig.png" alt="ig" width={40} height={40} />
                </motion.a>
                <motion.a
                  href="https://www.youtube.com/@neechemindustries"
                  target="_blank"
                  className="flex items-center"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    duration: 0.6,
                  }}
                >
                  <Image
                    src="/footer/youtube.png"
                    alt="youtube"
                    width={40}
                    height={40}
                  />
                </motion.a>
                <motion.a
                  href="mailto:neechem@rediffmail.com"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    duration: 0.6,
                  }}
                >
                  <Image
                    src="/footer/gmail.png"
                    alt="gmail"
                    width={40}
                    height={40}
                  />
                </motion.a>
                <motion.a
                  href="https://wa.me/9326797404"
                  target="_blank"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    duration: 0.6,
                  }}
                >
                  <Image
                    src="/footer/whatsapp.svg"
                    alt="whatsapp"
                    width={40}
                    height={40}
                  />
                </motion.a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-themeforeground mx-4 mb-2 md:mx-0 md:mb-0 w-[92vw] md:w-[50vw] xl:w-[20vw] gap-2 p-5 flex flex-col items-center shadow-lg md:shadow-none rounded-xl md:rounded-none">
          <motion.div
            className="mb-2"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Label className="text-md text-center font-zen">Quick Links</Label>
          </motion.div>
          <div className="gap-2 flex flex-col items-start">
            <motion.div
              className="text-sm flex items-center justify-center gap-2 cursor-pointer hover:text-blue-500"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => router.push("/aboutUs")}
            >
              <BadgeInfo /> About Us
            </motion.div>
            <ContactUs />
            <motion.div
              className="text-sm flex items-center justify-center gap-2 cursor-pointer hover:text-blue-500"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => router.push("/terms-of-service")}
            >
              <Handshake /> Terms of Service
            </motion.div>
            <motion.div
              className="text-sm flex items-center justify-center gap-2 cursor-pointer hover:text-blue-500"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => router.push("/privacy-policy")}
            >
              <ShieldCheck /> Privacy Policy
            </motion.div>
            <motion.div
              className="text-sm flex items-center justify-center gap-2 cursor-pointer hover:text-blue-500"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              onClick={() => router.push("/refund-policy")}
            >
              <CreditCard /> Refund Policy
            </motion.div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="bg-themeforeground mx-4 mb-2 md:mx-0 md:mb-0 w-[92vw] md:w-[50vw] xl:w-[25vw] gap-2 p-5 flex flex-col items-center shadow-lg md:shadow-none rounded-xl md:rounded-none">
          <motion.div
            className="mb-[12px]"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Label className="text-md font-zen">Contact Us</Label>
          </motion.div>
          <motion.div
            className="text-sm flex items-center justify-center gap-2 hover:text-blue-500"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Phone />
            +91 93267 97404
          </motion.div>
          <motion.div
            className="text-sm flex items-center justify-center gap-2 hover:text-blue-500"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Mail /> neechem@rediffmail.com
          </motion.div>
          <motion.div
            className="text-sm flex items-center justify-center gap-2 mt-2 hover:text-blue-500"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <MapPin /> Store Address:
          </motion.div>
          <motion.div
            className="text-sm text-center"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            28, New Apolo Industrial Estate, Mogra Village Road, Andheri East,
            Mumbai, Maharashtra 400069
          </motion.div>
        </div>
        <div className="bg-themeforeground mx-4 md:mx-0 w-[92vw] md:w-[50vw] xl:w-[25vw] p-5 shadow-lg md:shadow-none rounded-xl">
          <motion.iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120571.89228897801!2d72.77861547013391!3d19.200808219868122!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9d4c3ef9fbb%3A0xc50fa9c00a807647!2sNeechem%20Industries!5e0!3m2!1sen!2sin!4v1717803035093!5m2!1sen!2sin"
            loading="lazy"
            className="rounded-2xl w-full aspect-4/3"
            style={{ border: 0 }}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          ></motion.iframe>
        </div>
      </div>
    </div>
  );
};

export default Footer;
