import { gql } from 'graphql-request';
import { graphqlClient } from './graphql-client';
import type { Widget } from '../types/widget';
import { WidgetType } from '../types/widget';

export const GET_WIDGETS = gql`
  query GetWidgets {
    widgets {
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
  mutation CreateWidget($type: WidgetType!, $data: String) {
    createWidget(input: { type: $type, data: $data }) {
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

export const getWidgets = async (): Promise<Widget[]> => {
  const data = await graphqlClient.request<{ widgets: Widget[] }>(GET_WIDGETS);
  return data.widgets;
};

export const createWidget = async (type: WidgetType, data?: string): Promise<Widget> => {
  const response = await graphqlClient.request<{ createWidget: { widget: Widget; error?: string } }>(
    CREATE_WIDGET,
    { type, data }
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


