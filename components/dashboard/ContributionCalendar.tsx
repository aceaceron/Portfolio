"use client";

import React, { useEffect, useRef, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

type ContributionDay = {
  date: string;
  contributionCount: number;
};

type ContributionWeek = {
  contributionDays: ContributionDay[];
};

type Month = {
  firstDay: string;
  name: string;
  totalWeeks: number;
};

type CalendarData = {
  weeks: ContributionWeek[];
  months: Month[];
};

const LEVEL_COLORS = [
  "#FFF8E1", // very light gold (level 0)
  "#FFECB3", // light gold (level 1)
  "#FFD740", // medium gold (level 2)
  "#FFC107", // deep gold (level 3)
  "#FFB300", // darker gold (level 4)
];

// Weekday labels
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count < 5) return 1;
  if (count < 10) return 2;
  if (count < 20) return 3;
  return 4;
}

interface ContributionCalendarProps {
  calendar: CalendarData;
}

function generateMonths(weeks: ContributionWeek[]): Month[] {
  const months: Month[] = [];
  const seen = new Set<string>();

  weeks.forEach((week) => {
    const firstDay = week.contributionDays[0];
    const monthName = new Date(firstDay.date).toLocaleString("default", {
      month: "short",
    });
    const monthKey = `${monthName}-${new Date(firstDay.date).getFullYear()}`;

    if (!seen.has(monthKey)) {
      seen.add(monthKey);
      months.push({
        firstDay: firstDay.date,
        name: monthName,
        totalWeeks: 4, // placeholder
      });
    }
  });

  return months;
}

export default function ContributionCalendar({
  calendar,
}: ContributionCalendarProps) {
  const tooltipId = "custom-github-tooltip";

  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to start of day

  // Filter out future weeks and days
  const filteredWeeks = calendar.weeks
    .map((week) => {
      const filteredDays = week.contributionDays.filter((day) => {
        const dayDate = new Date(day.date);
        dayDate.setHours(0, 0, 0, 0);
        return dayDate <= today;
      });
      return { ...week, contributionDays: filteredDays };
    })
    .filter((week) => week.contributionDays.length > 0);

  // Generate months from filtered weeks if months not provided
  const months = (calendar.months ?? generateMonths(filteredWeeks)).filter(
    (month) => {
      const monthDate = new Date(month.firstDay);
      monthDate.setHours(0, 0, 0, 0);
      return monthDate <= today;
    }
  );

  const calendarRef = useRef<HTMLDivElement>(null);

  // Auto scroll to the end (smooth) on mount and when calendar updates
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.scrollTo({
        left: calendarRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [filteredWeeks.length, months.length]);

  const blockSize = 15;
  const blockMargin = 5;
  const weekWidth = blockSize + blockMargin;

  // Animation state
  const [animatedBlocks, setAnimatedBlocks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const allBlocks: string[] = [];
    filteredWeeks.forEach((week) =>
      week.contributionDays.forEach((day) => allBlocks.push(day.date))
    );

    // Shuffle array randomly
    for (let i = allBlocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allBlocks[i], allBlocks[j]] = [allBlocks[j], allBlocks[i]];
    }

    // Animate blocks sequentially
    allBlocks.forEach((id, index) => {
      setTimeout(() => {
        setAnimatedBlocks((prev) => new Set(prev).add(id));
      }, index * 1); 
    });
  }, [filteredWeeks]);

  return (
    <div>
      <div
        ref={calendarRef}
        className="calendar-scroll overflow-x-auto scroll-smooth p-2"
        style={{ maxWidth: "100%" }}
      >
        {/* Months Row */}
        <div
          style={{
            display: "flex",
            marginLeft: 30,
            marginBottom: 8,
            position: "relative",
            height: 20,
            fontSize: 12,
            color: "#FFD700",
            fontWeight: "600",
            userSelect: "none",
          }}
        >
          {months.map((month, index) => {
            if (index === 0 && months[0].name === months[1]?.name) return null;

            const firstDayDate = new Date(month.firstDay);
            let weekIndex = 0;
            for (let i = 0; i < filteredWeeks.length; i++) {
              const week = filteredWeeks[i];
              const firstWeekDay = new Date(week.contributionDays[0].date);
              if (firstWeekDay >= firstDayDate) {
                weekIndex = i;
                break;
              }
            }

            const width = month.totalWeeks * weekWidth - blockMargin;

            return (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: weekIndex * weekWidth,
                  width,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {month.name}
              </div>
            );
          })}
        </div>

        {/* Contribution Grid */}
        <div
          style={{
            display: "flex",
            gap: blockMargin,
            minWidth: `${filteredWeeks.length * weekWidth + 30}px`,
          }}
        >
          {/* Weekday Labels */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: blockMargin,
              marginTop: 0,
              width: 30,
            }}
          >
            {WEEKDAYS.map((day, idx) => (
              <div
                key={idx}
                style={{
                  height: blockSize,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  fontSize: 10,
                  color: "#FFD700",
                  userSelect: "none",
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Contribution Weeks */}
          {filteredWeeks.map((week, i) => {
            const firstDayOfWeek = new Date(week.contributionDays[0].date);
            const isFirstWeekOfYear =
              firstDayOfWeek.getDate() <= 7 && firstDayOfWeek.getMonth() === 0;
            const missingDays = 7 - week.contributionDays.length;
            const marginTop = isFirstWeekOfYear
              ? missingDays * (blockSize + blockMargin)
              : 0;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: blockMargin,
                  marginTop,
                }}
              >
                {week.contributionDays.map((day) => {
                  const level = getLevel(day.contributionCount);
                  const isAnimated = animatedBlocks.has(day.date);

                  return (
                    <div
                      key={day.date}
                      data-tooltip-id={tooltipId}
                      data-tooltip-content={`${day.contributionCount} contribution${
                        day.contributionCount !== 1 ? "s" : ""
                      } on ${new Date(day.date).toDateString()}`}
                      style={{
                        width: blockSize,
                        height: blockSize,
                        backgroundColor: LEVEL_COLORS[level],
                        borderRadius: 3,
                        cursor: "pointer",
                        transform: isAnimated ? "translateY(0)" : "translateY(-20px)",
                        opacity: isAnimated ? 1 : 0,
                        transition: "all 0.3s ease",
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>

        <ReactTooltip
          id={tooltipId}
          place="top"
          className="custom-github-tooltip"
        />

        <style jsx global>{`
          /* Tooltip */
          .custom-github-tooltip {
            background-color: rgb(31, 41, 55) !important;
            color: #ffd700 !important;
            border-radius: 4px !important;
            z-index: 1000 !important;
            padding: 4px 8px !important;
            font-size: 14px !important;
          }
          .custom-github-tooltip::before {
            border-top-color: rgb(31, 41, 55) !important;
          }

          /* Scrollbar auto-hide */
          .calendar-scroll::-webkit-scrollbar {
            height: 8px;
          }
          .calendar-scroll::-webkit-scrollbar-thumb {
            background: #ffd700;
            border-radius: 4px;
          }
          .calendar-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          /* Auto-hide unless hover/touch */
          .calendar-scroll::-webkit-scrollbar {
            visibility: hidden;
          }
          .calendar-scroll:hover::-webkit-scrollbar,
          .calendar-scroll:active::-webkit-scrollbar,
          .calendar-scroll:focus::-webkit-scrollbar {
            visibility: visible;
          }

          /* Firefox support */
          .calendar-scroll {
            scrollbar-width: thin;
            scrollbar-color: #ffd700 transparent;
          }
        `}</style>
      </div>

      {/* Fixed Legend under scroll */}
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-200 select-none">
        <span>Less</span>
        <div className="flex gap-1">
          {LEVEL_COLORS.map((color, idx) => (
            <div
              key={idx}
              style={{
                width: blockSize,
                height: blockSize,
                backgroundColor: color,
                borderRadius: 3,
                border: "1px solid #999",
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
