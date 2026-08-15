import { ChamadaFinal } from "@/components/home/ChamadaFinal";
import { Destaques } from "@/components/home/Destaques";
import { Hero } from "@/components/home/Hero";
import { Instagram } from "@/components/home/Instagram";
import { JardimVertical } from "@/components/home/JardimVertical";
import { Provas } from "@/components/home/Provas";

export default function Home() {
  return (
    <>
      <Hero />
      <Provas />
      <Destaques />
      <JardimVertical />
      <Instagram />
      <ChamadaFinal />
    </>
  );
}
