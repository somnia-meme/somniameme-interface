import { useRef, useEffect, useCallback, memo } from "react";
import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  IChartApi,
  ISeriesApi,
  LineStyle,
} from "lightweight-charts";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const ChartComponentBase = (props: any) => {
  const { address, interval } = props;
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const isInitializedRef = useRef<boolean>(false);

  const ohlcvQuery = useQuery({
    queryKey: ["ohlcv", address, interval],
    queryFn: async () =>
      await api
        .get("/tokens/" + address + "/ohlcv", {
          params: {
            interval,
          },
        })
        .then((res) => {
          const _data = res.data;

          const mappedData = _data.map((item: any) => ({
            time: new Date(item.timestamp).getTime() / 1000,
            open: Number(item.open),
            high: Number(item.high),
            low: Number(item.low),
            close: Number(item.close),
            volume: Number(item.volume),
          }));

          return mappedData;
        }),
    refetchInterval: 2500,
  });

  const initializeChart = useCallback(() => {
    if (!chartContainerRef.current || isInitializedRef.current) return;
    isInitializedRef.current = true;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "var(--surface)" },
        textColor: "var(--primary-lighter)",
        fontFamily: "Space Grotesk, Inter, sans-serif",
      },
      grid: {
        vertLines: {
          color: "var(--overlay-indigo)",
          style: LineStyle.Dotted,
        }, 
        horzLines: {
          color: "var(--overlay-indigo)",
          style: LineStyle.Dotted,
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      crosshair: {
        vertLine: {
          color: "var(--overlay-purple)",
          width: 1,
          style: LineStyle.Dashed,
        },
        horzLine: {
          color: "var(--overlay-purple)",
          width: 1,
          style: LineStyle.Dashed,
        },
      },
      timeScale: {
        borderColor: "var(--secondary-dark)",
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: any) => {
          const date = new Date(time * 1000);
          return (
            date.getHours() +
            ":" +
            (date.getMinutes() < 10 ? "0" : "") +
            date.getMinutes()
          );
        },
      },
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.7,
        bottom: 0,
      },
      borderColor: "rgba(139, 92, 246, 0.2)",
    });

    const mainSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e", // green-500
      downColor: "#ef4444", // red-500
      borderUpColor: "#16a34a", // green-600
      borderDownColor: "#dc2626", // red-600
      wickUpColor: "#16a34a", // green-600
      wickDownColor: "#dc2626", // red-600
      priceFormat: {
        type: "custom",
        formatter: (value: number) => {
          const zeroCount = value.toString().split(".")[1]?.length || 0;
          return zeroCount > 9 ? value.toFixed(9) : value;
        },
      },
    });

    mainSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.4,
      },
      borderColor: "rgba(139, 92, 246, 0.2)",
      autoScale: true,
    });

    chartRef.current = chart;
    mainSeriesRef.current = mainSeries;
    volumeSeriesRef.current = volumeSeries;
  }, []);

  const handleResize = useCallback(() => {
    if (chartContainerRef.current && chartRef.current) {
      chartRef.current.applyOptions({
        width: chartContainerRef.current.clientWidth,
      });
    }
  }, []);

  useEffect(() => {
    initializeChart();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        mainSeriesRef.current = null;
        volumeSeriesRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, [initializeChart, handleResize]);

  useEffect(() => {
    if (!isInitializedRef.current) {
      initializeChart();
    }

    if (!ohlcvQuery.data || !mainSeriesRef.current || !volumeSeriesRef.current)
      return;

    const data = [...ohlcvQuery.data];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const previousItem = data[i - 1];

      if (previousItem) {
        item.open = previousItem.close;
      }
    }

    const volumeData = data.map((item: any) => ({
      time: item.time,
      value: Number(item.volume) || 0,
      color:
        item.close >= item.open
          ? "rgba(34, 197, 94, 0.3)"
          : "rgba(239, 68, 68, 0.3)",
    }));

    requestAnimationFrame(() => {
      if (volumeSeriesRef.current && mainSeriesRef.current) {
        volumeSeriesRef.current.setData(volumeData);
        mainSeriesRef.current.setData(data);
      }
    });
  }, [ohlcvQuery.data, initializeChart]);

  return (
    <div className="relative h-[400px] w-full rounded-xl overflow-hidden backdrop-blur-md border border-indigo-500/20">
      {/* Chart loading overlay */}
      {ohlcvQuery.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
            <span className="text-indigo-300">Loading chart data...</span>
          </div>
        </div>
      )}
      {/* Empty state */}
      {ohlcvQuery.data?.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
          <div className="text-center p-6">
            <svg
              className="w-12 h-12 text-indigo-400 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-bold text-white mb-1">
              No chart data available
            </h3>
            <p className="text-indigo-300">
              This token doesn't have enough trading activity yet.
            </p>
          </div>
        </div>
      )}
      <div ref={chartContainerRef} className="h-[400px] w-full" />
    </div>
  );
};

export const ChartComponent = memo(ChartComponentBase);
