"use client";

import { useState } from "react";
import { MessageSquare, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/saelim.aji@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(Object.fromEntries(formData)),
        },
      );

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
        }, 3000);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to send feedback. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-6 right-6 z-[90] flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-[48px] w-[160px] rounded-full font-bold shadow-[0_8px_32px_rgba(37,99,235,0.3)] transition-all hover:scale-110 active:scale-95 group sm:bottom-8 sm:right-8">
          <MessageSquare className="h-5 w-5 transition-transform group-hover:-rotate-12" />
          <span>Feedback</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-blue-500/20 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Send Feedback
          </DialogTitle>
          <DialogDescription>
            Share your thoughts, report a bug, or suggest a feature. We love to
            hear from you!
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-blue-500" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-lg">Thank You!</h4>
              <p className="text-sm text-muted-foreground">
                Your feedback has been sent successfully.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Input
                name="email"
                type="email"
                placeholder="Email (optional)"
                className="bg-muted/30 border-blue-500/10 focus-visible:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                name="message"
                placeholder="How can we improve MorphIMG?"
                className="min-h-[120px] bg-muted/30 border-blue-500/10 focus-visible:ring-blue-500 resize-none"
                required
              />
            </div>
            <input
              type="hidden"
              name="_subject"
              value="New Feedback from MorphIMG"
            />
            <input type="hidden" name="_honey" style={{ display: "none" }} />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
