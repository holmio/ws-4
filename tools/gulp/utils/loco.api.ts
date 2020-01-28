import * as request from 'request-promise';
const LOCO_BASE_URL = 'https://localise.biz/api';

export type fileExtensions = 'po' | 'pot' | 'ts' | 'tmx' | 'xlf' | 'resx' | 'plist' | 'blist' |
'strings' | 'properties' | 'yml' | 'xml' | 'php' | 'json';

/**
 * Loco Api
 * Service to call the REST Loco API.
 */
export class LocoApi {

  // Holds value of the api key for loco service
  private apiKey: string;

  // BaseUrl for loco service
  private baseUrl: string;

  constructor(key: string) {
    if (!key) {
      throw new Error('Loco API: You must have an API key to use Loco API.');
    }
    this.apiKey = String(key).replace(/(\r\n|\n|\r)/gm, '');
    this.baseUrl = LOCO_BASE_URL || 'https://localise.biz/api';
  }

  /**
   * Lists all locales in currently authenticated project.
   * Your native/source language will always be the first in the list
   */
  getLocales() {
    const options = {
      method: 'GET',
      qs: {
        key: this.apiKey
      },
      uri: this.baseUrl + '/locales',
      timeout: 1000
    };
    return request(options);
  }

  /**
   * Export translations from your project to a locale-specific language pack.
   * @param locale Locale to export, specified as short code or language tag. e.g. 'en' or 'en_GB'.
   * @param tags Filter assets by comma-separated tag names.
   */
  exportLocale(locale: string, tags?: string[]) {
    const options = {
      method: 'GET',
      qs: {
        filter: tags && tags.join(', '),
        format: 'json', // ng-getText
        key: this.apiKey,
        status: 'translated'
      },
      uri: this.baseUrl + '/export/locale/' + locale + '.json'
    };

    return request(options);
  }

  /**
   * The import API loads translations from various language pack formats into the currently authenticated project.
   * @param assets New assets added to project (always empty when async=1).
   * @param extension File extension for the type of file data you're importing.
   * @param locale Locales identified according to 'index' and 'locale' parameters.
   */
  importAsync(assets: any, extension: fileExtensions = 'json', locale?: string) {
    const options = {
      method: 'POST',
      qs: {
        async: false,
        index: 'id',
        key: this.apiKey,
        locale: locale,
      },
      body: assets,
      uri: this.baseUrl + '/import/' + extension,
    };
    return request(options);
  }
}
