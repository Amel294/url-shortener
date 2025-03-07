import { useState } from "react";
import api from "@/utils/api"; // Import Axios instance
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCopy, Link2, Loader2 } from "lucide-react";
import axios from "axios";
import usePageStore from "@/store/pageStore";
import { Alert } from "./ui/alert";

export default function Home() {
  const [url, setUrl] = useState( "" );
  const [shortenedUrl, setShortenedUrl] = useState( "" );
  const [isLoading, setIsLoading] = useState( false );
  const [copied, setCopied] = useState( false );
  const [error, setError] = useState( "" );
  const [clicks, setClicks] = useState<number | null>( null );
  const setCurrentPage = usePageStore( ( state ) => state.setCurrentPage );

  const handleShowClicks = async () => {
    if ( !shortenedUrl ) return;

    const shortCode = shortenedUrl.split( "/" ).pop();
    try {
      const { data } = await api.get( `/clicks/${ shortCode }` );
      console.log( data.clicks )
      setClicks( data.clicks );
    } catch ( error ) {
      console.error( "Error fetching click count:", error );
      setError( "Failed to fetch click count" );
    }
  };

  const handleShorten = async ( e: React.FormEvent<HTMLFormElement> ) => {
    e.preventDefault();

    if ( !url.trim() ) {
      setError( "Please enter a URL" );
      return;
    }

    let formattedUrl = url.trim();
    if ( !/^https?:\/\//i.test( formattedUrl ) ) {
      formattedUrl = `https://${ formattedUrl }`;
    }

    setIsLoading( true );
    setError( "" );

    try {
      const { data } = await api.post( "/shortenUrl", { originalUrl: formattedUrl } );
      setShortenedUrl( `${ import.meta.env.VITE_API_URL }${ data.shortUrl }` );
    } catch ( err ) {
      if ( axios.isAxiosError( err ) && err.response ) {
        setError( err.response.data.message || "Something went wrong" );
      } else {
        setError( "An unexpected error occurred" );
      }
    } finally {
      setIsLoading( false );
    }
  };

  const handleCopy = () => {
    if ( shortenedUrl ) {
      navigator.clipboard.writeText( shortenedUrl );
      setCopied( true );
      setTimeout( () => setCopied( false ), 2000 );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" />
            URL Shortener
          </CardTitle>
          <CardDescription>Enter a long URL to create a shorter, more manageable link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleShorten} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter a URL (e.g., example.com)"
                value={url}
                onChange={( e ) => setUrl( e.target.value )}
                className="w-full"
              />
              {error && (
                <Alert variant="destructive" className="py-2">
                {error}
              </Alert>
              
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Shortening...
                </>
              ) : (
                "Shorten URL"
              )}
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or see Analytics
              </span>
            </div>
            <Button variant="outline" className="w-full" onClick={()=>setCurrentPage('tracking')}>
              Go to Analytics
            </Button>
          </form>

          {shortenedUrl && (
            <div className="mt-6 space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Your shortened URL:</div>
              <div className="flex items-center gap-2">
                <Input value={shortenedUrl} readOnly className="flex-1 bg-muted/50" />
                <Button size="icon" variant="outline" onClick={handleCopy} className="shrink-0">
                  <ClipboardCopy className="h-4 w-4" />
                </Button>
              </div>
              {copied && <p className="text-sm text-green-600">Copied to clipboard!</p>}
            </div>
          )}
        </CardContent>

        {shortenedUrl && (
          <CardFooter className="flex gap-10">
            <Button onClick={handleShowClicks}>Show Number of Clicks</Button>
            {clicks && <Input value={clicks} readOnly className="flex-1 bg-muted/50 text-white" />}
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
