export const WidgetType = {
  LINE_CHART: 'LINE_CHART',
  BAR_CHART: 'BAR_CHART',
  TEXT: 'TEXT'
} as const;

export type WidgetType = typeof WidgetType[keyof typeof WidgetType];

export interface Widget {
  id: string;
  type: WidgetType;
  position: number;
  data?: string;
  createdAt: string;
  updatedAt: string;
}


