"use client";

import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Edit, MessageCircle, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CommentForm } from "./CommentForm";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { useUserId } from "@/hooks/use-userId";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteCommentAlertDialogContent from "./DeleteCommentAlertDialogContent";
import CustomPagination from "@/components/CustomPagination";

interface User {
  id: string;
  image: string | null;
  name: string | null;
}

interface Comment {
  id: string;
  listId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
}

interface SharedListProps {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  tags: string[];
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
  };
  original: {
    words: {
      id: string;
      english: string;
      korean: string;
      example: string | null;
    }[];
  };
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }[];
}

interface Props {
  sharedList: SharedListProps;
  comments: Comment[];
}

const ITEMS_PER_PAGE = 10;

export function CommentSection({ sharedList, comments }: Props) {
  const userId = useUserId();
  const [editComment, setEditComment] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleComments = comments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditComment = (comment: { id: string; content: string }) => {
    setEditComment(comment);
  };

  const handleUpdateComment = () => {
    setEditComment(null);
  };

  return (
    <TabsContent value="comments" className="p-6 min-h-[600px]">
      <CommentForm listId={sharedList.id} editComment={null} />
      <div className="space-y-4 mt-6">
        {visibleComments.length > 0 ? (
          visibleComments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-4 p-4 bg-gray-50 rounded-xl relative group"
            >
              <Avatar className="h-10 w-10 rounded-xl">
                <AvatarImage src={comment.user.image || ""} />
                <AvatarFallback className="bg-blue-100 text-blue-800">
                  {comment.user.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{comment.user.name}</span>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                {userId === comment.user.id &&
                editComment?.id === comment.id ? (
                  <CommentForm
                    listId={sharedList.id}
                    editComment={editComment}
                    onCancelEdit={() => setEditComment(null)}
                    onUpdateComment={handleUpdateComment}
                  />
                ) : (
                  <p className="text-gray-700">{comment.content}</p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 absolute top-4 right-4"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                {userId === comment.user.id && (
                  <DropdownMenuContent align="start" className="w-32 bg-white">
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer data-[highlighted]:bg-gray-100 transition-colors"
                      onClick={() =>
                        handleEditComment({
                          id: comment.id,
                          content: comment.content,
                        })
                      }
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <div>
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </div>
                      </AlertDialogTrigger>
                      <DeleteCommentAlertDialogContent commentId={comment.id} />
                    </AlertDialog>
                  </DropdownMenuContent>
                )}
              </DropdownMenu>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </TabsContent>
  );
}
