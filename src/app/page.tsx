import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex-grow pt-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between py-16">
          {/* Hero Text */}
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              당신만을 위한 영어 학습 경로를 시작하세요!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              레벨 테스트와 목표 설정으로 가장 적합한 학습 계획을 추천받으세요.
            </p>
            <Button size="lg" className="text-lg px-8 py-6">
              지금 시작하기
            </Button>
          </div>

          {/* Hero Image */}
          <div className="md:w-1/2">
            <div className="bg-gray-200 rounded-lg p-8">
              <Image
                src="/file.svg"
                width={600}
                height={400}
                alt="Learning Path Illustration"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
