import { useState, useEffect } from "react";

export function useAddToHomescreenPrompt() {
  const [promptable, setPromptable] = useState(null);

  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
  });

  const promptToInstall = () => {
    if (promptable) {
      return promptable.prompt();
    }
    return Promise.reject(
      new Error(
        'Tried installing before browser sent "beforeinstallprompt" event'
      )
    );
  };

  useEffect(() => {
    const ready = (e) => {
      e.preventDefault();
      setPromptable(e);
    };

    window.addEventListener("beforeinstallprompt", ready);

    return () => {
      window.removeEventListener("beforeinstallprompt", ready);
    };
  }, []);

  useEffect(() => {
    const onInstall = () => {
      setIsInstalled(true);
    };

    window.addEventListener("appinstalled", onInstall);

    return () => {
      window.removeEventListener("appinstalled", onInstall);
    };
  }, []);

  return [promptable, promptToInstall, isInstalled];
}
