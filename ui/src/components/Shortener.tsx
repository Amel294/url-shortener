import React, { FC, useState } from "react";
import axios from "axios";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Form } from "@heroui/form";
import { Alert } from "@heroui/alert";
import { ClipboardCopy, Link2, Loader2 } from "lucide-react";

import api from "@/utils/api";

export const Shortener: FC = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("Please enter a URL");

      return;
    }

    let formattedUrl = url.trim();

    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/shortenUrl", {
        originalUrl: formattedUrl,
      });

      setShortenedUrl(`${import.meta.env.VITE_API_URL}${data.shortUrl}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Something went wrong");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="p-2 w-[90vw] sm:w-[50vw] sm:p-2 md:p-8 lg:p-10 xl:p-12">
      <Card className="p-4 w-full mx-auto">
        <CardHeader className="flex flex-col gap-1">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" />
            URL Shortener
          </h1>
          <p className="text-small text-default-500">
            Enter a long URL to make it shorter
          </p>
        </CardHeader>

        <CardBody>
          <Form
            className="flex flex-col md:flex-row gap-2"
            onSubmit={handleShorten}
          >
            <Input
              className="flex-1 w-full"
              placeholder="Enter URL here"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button
              className="w-full md:w-auto"
              color="primary"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Shortening...
                </>
              ) : (
                "Shorten"
              )}
            </Button>
          </Form>

          {/* Error Message */}
          {error && (
            <Alert
              isClosable
              className="mt-2 py-2"
              variant="flat"
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* Shortened URL */}
          {shortenedUrl && (
            <div className="mt-6 space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Your shortened URL:
              </div>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  className="flex-1 bg-muted/50"
                  value={shortenedUrl}
                />
                <Button
                  className="shrink-0"
                  size="lg"
                  variant="faded"
                  onClick={handleCopy}
                >
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
              {copied && (
                <p className="text-sm text-green-600">
                  ✅ Copied to clipboard!
                </p>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </section>
  );
};

export default Shortener;
