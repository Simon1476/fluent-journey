import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  const getPageNumbers = () => {
    const pageNumbers = [];

    pageNumbers.push(1);

    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    if (rangeStart > 2) {
      pageNumbers.push("ellipsis-start");
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pageNumbers.push("ellipsis-end");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 pt-6 mt-6 border-t border-gray-100">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={`transition-all ${
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-indigo-50 hover:text-indigo-700"
              }`}
              aria-disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </Button>
          </PaginationItem>

          {getPageNumbers().map((page, index) => {
            if (page === "ellipsis-start" || page === "ellipsis-end") {
              return (
                <PaginationItem key={`${page}-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={`page-${index}`}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={() => onPageChange(page as number)}
                  className={`transition-all cursor-pointer ${
                    currentPage === page
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "hover:bg-indigo-50 hover:text-indigo-700"
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <Button
              onClick={() =>
                onPageChange(Math.min(totalPages, currentPage + 1))
              }
              className={`transition-all ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "hover:bg-indigo-50 hover:text-indigo-700"
              }`}
              aria-disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/* 페이지 상단/하단 이동 버튼 (옵션) */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors"
          aria-label="Scroll to top"
        >
          <ChevronUp size={18} />
        </button>
        <button
          onClick={() =>
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            })
          }
          className="p-2 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition-colors"
          aria-label="Scroll to bottom"
        >
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}
