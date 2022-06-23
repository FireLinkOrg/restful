import type { RoutePlannerStatusResponse, LoadTrackResponse, LavalinkTrack, LavalinkSource } from '@firelink/types';
import { LavalinkSourceEnum, LavalinkSearchIdentifierEnum, Routes } from '@firelink/types';
import { fetch, FetchResultTypes } from '@firelink/fetch';
import { AsyncQueue } from '@sapphire/async-queue';
import type { RequestInit } from 'undici';

export class RESTFUL {
    public headers: { [key: string]: string } = {};
    public queue = new AsyncQueue();

    public routeplanner = {
		freeAddress: async (address: string): Promise<void> => {
			await this.post<string>(Routes.routePlannerFreeAddress(), { body: JSON.stringify({ address }) });
		},
		freeAllAddress: async (): Promise<void> => {
			await this.post<string>(Routes.routePlannerFreeAll());
		},
		status: async (): Promise<RoutePlannerStatusResponse> => {
			return this.get<RoutePlannerStatusResponse>(Routes.routePlannerStatus());
		}
	};

    public constructor(public url: string, headers: { [key: string]: string } = {}) {
		this.headers = headers;
	}

    public isUrl(url: string) {
        try {
            new URL(url);
            return true;
        } catch (_e) {
            return false;
        }
    }

    public resolveIdentifier(source: LavalinkSource) {
		return source === LavalinkSourceEnum.Youtube
			? LavalinkSearchIdentifierEnum.YT_SEARCH
			: source === LavalinkSourceEnum.Soundcloud
			? LavalinkSearchIdentifierEnum.SC_SEARCH
			: source === LavalinkSearchIdentifierEnum.YTM_SEARCH
			? LavalinkSearchIdentifierEnum.YTM_SEARCH
			: source;
	}

    public setAuthorization(auth: string) {
        this.headers['Authorization'] = auth;
        return this;
    }

	public loadTracks(options: { source?: LavalinkSource, query: string } | string) {
		if (typeof options === 'string') {
			return this.get<LoadTrackResponse>(
				Routes.loadTracks(
					this.isUrl(options)
					? encodeURIComponent(options)
					: encodeURIComponent(`${this.resolveIdentifier(LavalinkSourceEnum.Youtube)}:${options}`)
				)
			)
		}

		const source = options.source ?? LavalinkSourceEnum.Youtube;
		const { query } = options;
		return this.get<LoadTrackResponse>(
			Routes.loadTracks(
				this.isUrl(options.query) ? encodeURIComponent(query) : `${encodeURIComponent(`${this.resolveIdentifier(source)}`)}:${query}`
			)
		)
	}
}