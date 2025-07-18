import { Template } from '../../document/paper-util';

export type StepType =
  | 'generate'
  | 'sign'
  | 'verifyAndSign'
  | 'upload'
  | 'verify';

export interface CheklistStep {
  type: StepType;
  forRoles?: string[];
  ready?: Date;
}

export interface ChecklistItem {
  name: string;
  subName?: string;
  template?: Template;
  paperId?: string;
  steps: CheklistStep[];
}
