import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4 text-center text-white">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            영어 단어 실력을 향상시키세요
          </h1>
          <p className="text-lg mb-8">
            한 곳에서 단어장을 생성하고, 공유하고, 테스트하세요. 매일 영어 단어
            실력을 향상시키는 수천 명의 학습자들과 함께하세요.
          </p>
          <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
            무료로 시작하기
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 relative after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-600 after:mx-auto after:mt-2">
            가능한 기능
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                  <i className="fas fa-book"></i>
                </div>
                <CardTitle>단어장 생성</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  모든 주제나 레벨에 맞는 개인 맞춤형 단어장을 만드세요. 정의,
                  예문, 이미지까지 추가할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                  <i className="fas fa-share-alt"></i>
                </div>
                <CardTitle>단어장 공유</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  친구, 학급 친구들, 또는 전체 커뮤니티와 단어장을 공유하세요.
                  함께 협력하고 배우세요.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                  <i className="fas fa-tasks"></i>
                </div>
                <CardTitle>단어 테스트</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  플래시카드, 객관식, 철자 등 다양한 테스트 모드로 자신의 지식을
                  시험해보세요.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="text-4xl text-blue-600 mb-4 flex justify-center">
                  <i className="fas fa-comment"></i>
                </div>
                <CardTitle>커뮤니티 참여</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  공유된 단어장에 좋아요, 북마크 및 댓글을 달 수 있습니다.
                  커뮤니티가 큐레이션한 최고의 자료를 찾아보세요.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="text-3xl text-blue-400 font-bold mb-2">1천만+</h3>
              <p>학습된 단어</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl text-blue-400 font-bold mb-2">50만+</h3>
              <p>활성 사용자</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl text-blue-400 font-bold mb-2">10만+</h3>
              <p>공유된 단어장</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl text-blue-400 font-bold mb-2">98%</h3>
              <p>성공률</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Lists Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 relative after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-600 after:mx-auto after:mt-2">
            인기 단어장
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h3 className="text-xl font-bold">토플 필수 단어</h3>
                <div className="flex justify-between text-sm mt-2">
                  <span>제작자: 단어마스터</span>
                  <span>450 단어</span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between py-2 border-b">
                  <span>ubiquitous</span>
                  <span>어디에나 존재하는</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>pragmatic</span>
                  <span>실용적인</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>benevolent</span>
                  <span>자비로운, 친절한</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 flex justify-between p-4">
                <Button size="sm">지금 학습하기</Button>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <i className="far fa-heart"></i>
                    <span>2.4K</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <i className="far fa-bookmark"></i>
                    <span>1.8K</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <i className="far fa-comment"></i>
                    <span>156</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h3 className="text-xl font-bold">비즈니스 영어</h3>
                <div className="flex justify-between text-sm mt-2">
                  <span>제작자: 커리어부스트</span>
                  <span>320 단어</span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between py-2 border-b">
                  <span>leverage</span>
                  <span>활용하다, 지렛대 원리를 이용하다</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>diversify</span>
                  <span>다양화하다</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>acquisition</span>
                  <span>인수, 취득</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 flex justify-between p-4">
                <Button size="sm">지금 학습하기</Button>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <i className="far fa-heart"></i>
                    <span>1.9K</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <i className="far fa-bookmark"></i>
                    <span>1.2K</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <i className="far fa-comment"></i>
                    <span>98</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <h3 className="text-xl font-bold">구동사 마스터</h3>
                <div className="flex justify-between text-sm mt-2">
                  <span>제작자: 영어선생님</span>
                  <span>200 구문</span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between py-2 border-b">
                  <span>break down</span>
                  <span>고장나다, 감정적으로 무너지다</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>figure out</span>
                  <span>이해하다, 알아내다</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>give up</span>
                  <span>포기하다, 그만두다</span>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 flex justify-between p-4">
                <Button size="sm">지금 학습하기</Button>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <i className="far fa-heart"></i>
                    <span>3.2K</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <i className="far fa-bookmark"></i>
                    <span>2.7K</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-600 text-sm">
                    <i className="far fa-comment"></i>
                    <span>215</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 relative after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-600 after:mx-auto after:mt-2">
            이용 방법
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">단어장 만들기</h3>
              <p>
                단어, 정의, 예문, 메모를 추가하여 개인 맞춤형 단어장을 만드세요.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">학습 및 연습</h3>
              <p>간격 반복 및 다양한 연습 방법을 통해 단어를 암기하세요.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">지식 테스트</h3>
              <p>
                다양한 테스트 형식으로 자신을 도전하여 단어를 완전히 익혔는지
                확인하세요.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">공유 및 협업</h3>
              <p>
                단어장을 공유하고, 피드백을 받고, 다른 학습자의 단어 세트를
                발견하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 relative after:content-[''] after:block after:w-20 after:h-1 after:bg-blue-600 after:mx-auto after:mt-2">
            사용자 후기
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="shadow-lg relative">
              <CardContent className="p-6 pt-8">
                <div className="absolute text-6xl text-gray-200 top-2 left-4 font-serif">
                  {""}
                </div>
                <p className="relative z-10 mb-4">
                  {
                    "  이 웹사이트는 내 토플 준비에 게임 체인저였어요. 단 두 달 만에 어휘력 점수가 25% 향상됐습니다!"
                  }
                </p>
                <div className="flex items-center mt-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">사라 K.</h4>
                    <p className="text-sm text-gray-600">토플 수험생</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg relative">
              <CardContent className="p-6 pt-8">
                <div className="absolute text-6xl text-gray-200 top-2 left-4 font-serif">
                  {""}
                </div>
                <p className="relative z-10 mb-4">
                  {
                    "학생들과 단어장을 공유하고 진행 상황을 추적할 수 있어 좋아요. 테스트 기능 덕분에 영어 교사로서의 일이 훨씬 쉬워졌습니다."
                  }
                </p>
                <div className="flex items-center mt-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">마크 T.</h4>
                    <p className="text-sm text-gray-600">ESL 교사</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg relative">
              <CardContent className="p-6 pt-8">
                <div className="absolute text-6xl text-gray-200 top-2 left-4 font-serif">
                  {""}
                </div>
                <p className="relative z-10 mb-4">
                  {
                    "다양한 어휘 앱을 사용해 봤지만, 이 앱은 커뮤니티 기능이 돋보입니다. 원어민이 만든 고품질 단어장을 찾을 수 있어 비즈니스 영어가 크게 향상됐어요."
                  }
                </p>
                <div className="flex items-center mt-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">준 L.</h4>
                    <p className="text-sm text-gray-600">비즈니스 전문가</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="max-w-md mx-auto mb-8">
            <h3 className="text-xl font-bold mb-2">뉴스레터 구독</h3>
            <p className="mb-4">
              매주 어휘 팁, 새로운 단어장, 학습 자료를 받아보세요.
            </p>
            <div className="flex">
              <Input
                type="email"
                placeholder="이메일 주소"
                className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className="bg-pink-600 hover:bg-pink-700 rounded-l-none">
                구독하기
              </Button>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <Link href="#" className="text-white text-xl">
              <Facebook />
            </Link>
            <Link href="#" className="text-white text-xl">
              <Twitter />
            </Link>
            <Link href="#" className="text-white text-xl">
              <Instagram />
            </Link>
            <Link href="#" className="text-white text-xl">
              <Youtube />
            </Link>
          </div>

          <p className="text-center">
            &copy; 2025 Fluent Journey - 당신의 영어 단어 학습 동반자. 모든 권리
            보유.
          </p>
        </div>
      </footer>
    </div>
  );
}
