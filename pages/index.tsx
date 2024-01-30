import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const a = {
    a: 1,
    b: 1
  }
  return (
    <>
      Hello World!
    </>
  );
}
