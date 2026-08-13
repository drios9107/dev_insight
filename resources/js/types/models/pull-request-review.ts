import { IUser } from "../user";
import { IPullRequest } from "./pull-request";

export interface IPullRequestReview {
    id: number;
    github_id: string;
    reviewer: IUser;
    pull_request: IPullRequest;
    state: TPullRequestReviewState;
    body: string;
    submitted_at: string;
    created_at: string;
    updated_at: string;
}

export type TPullRequestReviewState = 'approved' | 'changes_requested' | 'commented' | 'dismissed'
