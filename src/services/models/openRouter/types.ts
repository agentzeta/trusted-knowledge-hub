
import { Response } from '../../../types/query';

export interface OpenRouterModel {
  id: string;
  displayName: string;
}

export interface OpenRouterAPIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}
