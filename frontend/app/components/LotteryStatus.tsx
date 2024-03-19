import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLottery } from "../context/LotteryContext";
import Countdown, { zeroPad } from "react-countdown";
import { useRef } from "react";
import gsap from "gsap";

const LotteryStatus = ({ enterLotteryButtonRef }: any) => {
  const lotteryData = useLottery();
  const countdownRenderRef = React.useRef<HTMLDivElement>(null);
  const countdownComponentRef: any = useRef(null);
  const countdownCompletedRef: any = useRef(null);
  const initCalculatingWinnerTL: gsap.core.Timeline = gsap.timeline({
    paused: true,
  });
  const loadingCalculatingWinnerTL: gsap.core.Timeline = gsap.timeline({
    paused: true,
    repeat: -1,
    delay: 1,
  });
  const winnerTL: gsap.core.Timeline = gsap.timeline({ paused: true });
  const container = React.useRef<HTMLDivElement>(null);
  const raffleState = lotteryData?.raffleState;
  const timeSinceOpen = lotteryData?.timeSinceOpen ?? 0;
  const recentWinner = lotteryData?.recentWinner;
  const interval = lotteryData?.interval ?? 0;
  const isPending = lotteryData?.isPending;
  const raffleStateRef = useRef(raffleState);
  const recentWinnerRef = useRef(recentWinner);
  const [countdownCompleted, setCountdownCompleted] = useState(false);
  const [countdownKey, setCountdownKey] = useState(0);
  const [date, setDate] = useState(Date.now());

  const renderRaffleStatus = () => {
    if (raffleState === 1 && countdownCompleted) {
      enterLotteryButtonRef.current.disabled = true;
      // Render a "pending closure" badge when countdown is completed but state is still 1
      return (
        <span className="badge badge-warning badge-lg">Pending Closure</span>
      );
    }
    switch (raffleState) {
      case 0:
        return <span className="badge badge-primary badge-lg">Idle</span>;
      case 1:
        return (
          <span
            className={`transition-opacity ${
              raffleState == 1 ? "opacity-100" : ""
            } badge badge-success badge-lg`}
          >
            Open
          </span>
        );
      case 2:
        return <span className="badge badge-error badge-lg">Closed</span>;
      default:
        return null; // or some default state if needed
    }
  };

  const renderer = ({ minutes, seconds }: any) => {
    let adjustedTimeSinceOpen = timeSinceOpen > 1000 ? 0 : timeSinceOpen;
    gsap.set(countdownRenderRef.current, { color: "#00ff00" });
    gsap.to(countdownRenderRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power1.inOut",
    });
    gsap.to(countdownRenderRef.current, {
      color: "#FF0000",
      duration: interval - adjustedTimeSinceOpen,
      ease: "none",
    });
    return (
      <span className="text-5xl opacity-0" ref={countdownRenderRef}>
        {zeroPad(minutes)}:{zeroPad(seconds)}
      </span>
    );
  };

  useEffect(() => {
    recentWinnerRef.current = recentWinner;
  }, [recentWinner]);

  const showWinnerFlow = () => {
    const winnerContainerDiv = document.createElement("div");
    const winnerTextSpan = document.createElement("div");
    const winnerAddressSpan = document.createElement("span");

    winnerTextSpan.innerHTML = "Congratulations!";
    const winnerAddress =
      recentWinnerRef.current?.substring(0, 6) +
      "..." +
      recentWinnerRef.current?.slice(-4);
    winnerAddressSpan.innerHTML = winnerAddress;

    winnerContainerDiv.classList.add(
      "text-3xl",
      "text-center",
      "text-white",
      "flex",
      "flex-col",
      "gap-3",
      "opacity-0"
    );
    winnerContainerDiv.appendChild(winnerTextSpan);
    winnerContainerDiv.appendChild(winnerAddressSpan);

    if (container.current) {
      container.current.appendChild(winnerContainerDiv);

      winnerTL.to(winnerContainerDiv, {
        duration: 0.5,
        opacity: 1,
        ease: "power1.inOut",
      });

      winnerTL.to(
        winnerContainerDiv,
        {
          duration: 0.5,
          yoyo: true,
          repeat: 5,
          ease: "power1.inOut",
          filter:
            "drop-shadow(0px 0px 10px #fff) drop-shadow(0px 0px 2px #fff)",
        },
        "<"
      );

      winnerTL.to(winnerContainerDiv, {
        duration: 0.5,
        opacity: 0,
        ease: "power1.inOut",
      });

      winnerTL.eventCallback("onComplete", () => {
        winnerTL.pause();
        winnerTL.clear();
        winnerContainerDiv.remove();
      });

      winnerTL.play();
    }
  };

  const createCalculatingWinnerFlow = () => {
    const completedText = "Calculating Winner...";
    // Ensure container.current is not null and is empty before adding new spans
    if (container.current) {
      // Create a span for each letter
      for (let i = 0; i < completedText.length; i++) {
        const letter = completedText[i];
        const span = document.createElement("span");
        span.innerHTML = letter === " " ? "&nbsp;" : letter; // Use non-breaking space for spaces
        span.classList.add("opacity-0");
        container.current.appendChild(span);
      }
    }
    const completedTextSpans: any = container.current?.querySelectorAll("span");

    initCalculatingWinnerTL.to(completedTextSpans, {
      duration: 0.5,
      opacity: 1,
      ease: "power1.inOut",
    });

    initCalculatingWinnerTL.to(
      completedTextSpans,
      {
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        filter: "drop-shadow(0px 0px 10px #fff) drop-shadow(0px 0px 2px #fff)",
      },
      "<"
    );

    initCalculatingWinnerTL.eventCallback("onComplete", () => {
      let firstAnimationApplied = false;

      for (const span of completedTextSpans) {
        if (firstAnimationApplied) {
          loadingCalculatingWinnerTL.to(span, {
            duration: 0.25,
            y: -2,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
            filter:
              "drop-shadow(0px 0px 10px #fff) drop-shadow(0px 0px 2px #fff)",
          });
        } else {
          loadingCalculatingWinnerTL.to(
            span,
            {
              duration: 0.25,
              y: -2,
              yoyo: true,
              repeat: 1,
              ease: "power1.inOut",
              filter:
                "drop-shadow(0px 0px 10px #fff) drop-shadow(0px 0px 2px #fff)",
            },
            "-=75%"
          );
        }
      }
      loadingCalculatingWinnerTL.play();
    });

    loadingCalculatingWinnerTL.eventCallback("onRepeat", () => {
      if (raffleStateRef.current == 0) {
        loadingCalculatingWinnerTL.pause();
        loadingCalculatingWinnerTL.clear();
        initCalculatingWinnerTL.reverse();
        initCalculatingWinnerTL.eventCallback("onReverseComplete", () => {
          gsap.to(completedTextSpans, {
            duration: 0.5,
            opacity: 0,
            ease: "power1.inOut",
            onComplete: () => {
              completedTextSpans.forEach((span: HTMLSpanElement) => {
                if (span) {
                  span.remove();
                }
              });
              showWinnerFlow();
            },
          });
        });
      }
    });

    initCalculatingWinnerTL.play();
  };

  useEffect(() => {
    raffleStateRef.current = raffleState;
    if (raffleState === 0) {
      enterLotteryButtonRef.current.disabled = false;
    } else if (raffleState === 2) {
      enterLotteryButtonRef.current.disabled = true;
      setCountdownCompleted(false);
      createCalculatingWinnerFlow();
    }
  }, [raffleState]);

  useLayoutEffect(() => {
    if (!countdownComponentRef.current) return;
    if (raffleState === 1) {
      let adjustedTimeSinceOpen = timeSinceOpen > 1000 ? 0 : timeSinceOpen;
      if (interval - adjustedTimeSinceOpen > 0) {
        setDate(Date.now() - timeSinceOpen * 1000);
      } else {
        setDate(Date.now() - interval * 1000);
      }

      setCountdownKey((prev) => prev + 1);
    }

    // Your GSAP animations here
  }, [raffleState]);

  return (
    <div className="card h-56 bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex gap-10 text-lg font-bold">
          <p>Lotto Status:</p>
          <div className={`${isPending && "skeleton  animate-pulse"} `}>
            {renderRaffleStatus()}
          </div>
        </div>
        <div
          ref={container}
          className="flex justify-center items-center my-auto text-3xl"
        >
          {!!interval && raffleState == 1 && !countdownCompleted && (
            <Countdown
              ref={countdownComponentRef}
              key={countdownKey}
              date={date + interval * 1000}
              renderer={renderer}
              onComplete={() => {
                setCountdownCompleted(true);
              }}
            />
          )}
          {!!interval && raffleState == 1 && countdownCompleted && (
            <span
              ref={countdownCompletedRef}
              className="animate-pulse text-5xl text-[#ff0000]"
            >
              00:00
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LotteryStatus;
