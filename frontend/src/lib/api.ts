import { gql } from 'graphql-request';
import { graphqlClient } from './graphql-client';
import type { Widget } from '../types/widget';
import type { Dashboard } from '../types/dashboard';
import { WidgetType } from '../types/widget';

export const GET_DASHBOARDS = gql`
  query GetDashboards {
    dashboards {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const GET_DASHBOARD = gql`
  query GetDashboard($id: UUID!) {
    dashboard(id: $id) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_DASHBOARD = gql`
  mutation CreateDashboard($name: String!) {
    createDashboard(input: { name: $name }) {
      dashboard {
        id
        name
        createdAt
        updatedAt
      }
      error
    }
  }
`;

export const UPDATE_DASHBOARD = gql`
  mutation UpdateDashboard($id: UUID!, $name: String!) {
    updateDashboard(input: { id: $id, name: $name }) {
      dashboard {
        id
        name
        createdAt
        updatedAt
      }
      error
    }
  }
`;

export const DELETE_DASHBOARD = gql`
  mutation DeleteDashboard($id: UUID!) {
    deleteDashboard(input: { id: $id }) {
      success
      error
    }
  }
`;

export const GET_WIDGETS = gql`
  query GetWidgets($dashboardId: UUID!) {
    widgets(dashboardId: $dashboardId) {
      id
      type
      position
      data
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_WIDGET = gql`
  mutation CreateWidget($dashboardId: UUID!, $type: WidgetType!, $data: String) {
    createWidget(input: { dashboardId: $dashboardId, type: $type, data: $data }) {
      widget {
        id
        type
        position
        data
        createdAt
        updatedAt
      }
      error
    }
  }
`;

export const UPDATE_WIDGET = gql`
  mutation UpdateWidget($id: UUID!, $data: String) {
    updateWidget(input: { id: $id, data: $data }) {
      widget {
        id
        type
        position
        data
        createdAt
        updatedAt
      }
      error
    }
  }
`;

export const DELETE_WIDGET = gql`
  mutation DeleteWidget($id: UUID!) {
    deleteWidget(input: { id: $id }) {
      success
      error
    }
  }
`;

export const getDashboards = async (): Promise<Dashboard[]> => {
  const data = await graphqlClient.request<{ dashboards: Dashboard[] }>(GET_DASHBOARDS);
  return data.dashboards;
};

export const getDashboard = async (id: string): Promise<Dashboard> => {
  const data = await graphqlClient.request<{ dashboard: Dashboard }>(GET_DASHBOARD, { id });
  return data.dashboard;
};

export const createDashboard = async (name: string): Promise<Dashboard> => {
  const response = await graphqlClient.request<{ createDashboard: { dashboard: Dashboard; error?: string } }>(
    CREATE_DASHBOARD,
    { name }
  );
  if (response.createDashboard.error) {
    throw new Error(response.createDashboard.error);
  }
  return response.createDashboard.dashboard;
};

export const updateDashboard = async (id: string, name: string): Promise<Dashboard> => {
  const response = await graphqlClient.request<{ updateDashboard: { dashboard: Dashboard; error?: string } }>(
    UPDATE_DASHBOARD,
    { id, name }
  );
  if (response.updateDashboard.error) {
    throw new Error(response.updateDashboard.error);
  }
  return response.updateDashboard.dashboard;
};

export const deleteDashboard = async (id: string): Promise<void> => {
  const response = await graphqlClient.request<{ deleteDashboard: { success: boolean; error?: string } }>(
    DELETE_DASHBOARD,
    { id }
  );
  if (response.deleteDashboard.error) {
    throw new Error(response.deleteDashboard.error);
  }
};

// Widget API functions
export const getWidgets = async (dashboardId: string): Promise<Widget[]> => {
  const data = await graphqlClient.request<{ widgets: Widget[] }>(GET_WIDGETS, { dashboardId });
  return data.widgets;
};

export const createWidget = async (dashboardId: string, type: WidgetType, data?: string): Promise<Widget> => {
  const response = await graphqlClient.request<{ createWidget: { widget: Widget; error?: string } }>(
    CREATE_WIDGET,
    { dashboardId, type, data }
  );
  if (response.createWidget.error) {
    throw new Error(response.createWidget.error);
  }
  return response.createWidget.widget;
};

export const updateWidget = async (id: string, data: string): Promise<Widget> => {
  const response = await graphqlClient.request<{ updateWidget: { widget: Widget; error?: string } }>(
    UPDATE_WIDGET,
    { id, data }
  );
  if (response.updateWidget.error) {
    throw new Error(response.updateWidget.error);
  }
  return response.updateWidget.widget;
};

export const deleteWidget = async (id: string): Promise<void> => {
  const response = await graphqlClient.request<{ deleteWidget: { success: boolean; error?: string } }>(
    DELETE_WIDGET,
    { id }
  );
  if (response.deleteWidget.error) {
    throw new Error(response.deleteWidget.error);
  }
};


