import React from "react";
import {Button, Tooltip} from "@heroui/react";
import {ArrowUp} from "lucide-react";

const visibleScrollY = 320;

export const ScrollToTopButton = React.memo(() => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > visibleScrollY);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, {passive: true});

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handlePress = () => {
        window.scrollTo({
            behavior: "smooth",
            top: 0,
        });
    };

    return (
        <div className={`fixed bottom-5 right-5 z-40 transition duration-200 sm:bottom-6 sm:right-6 ${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}>
            <Tooltip delay={0}>
                <Button
                    aria-label="返回頂部"
                    className="h-11 w-11 rounded-full border border-neutral-800 bg-neutral-900/95 px-0 text-neutral-100 shadow-lg shadow-neutral-950/20 backdrop-blur hover:bg-neutral-800 dark:border-neutral-200 dark:bg-white/95 dark:text-neutral-950 dark:shadow-black/30 dark:hover:bg-neutral-100"
                    size="md"
                    variant="ghost"
                    onPress={handlePress}
                >
                    <ArrowUp className="size-5" />
                </Button>
                <Tooltip.Content showArrow placement="left">
                    <Tooltip.Arrow />
                    返回頂部
                </Tooltip.Content>
            </Tooltip>
        </div>
    );
});
