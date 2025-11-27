import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative bg-muted/30 py-12 md:py-20 overflow-hidden">
      <div className="container px-4 mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left z-10">
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-foreground">
            Tecnologia Premium para <span className="text-primary">Você</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto md:mx-0">
            Descubra nossa seleção exclusiva de eletrônicos e acessórios de alta performance. 
            Qualidade garantida e entrega rápida para todo o Brasil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" className="text-base px-8">
              Ver Ofertas
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8">
              Lançamentos
            </Button>
          </div>
        </div>
        <div className="flex-1 relative w-full max-w-lg aspect-square md:aspect-[4/3]">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl -z-10" />
          <Image
            src="/diverse-products-still-life.png"
            alt="Produtos em destaque"
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>
    </section>
  );
}
