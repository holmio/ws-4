import { LocoApi } from '../utils/loco.api';
import * as colors from 'ansi-colors';
import * as log from 'fancy-log';
import { readFileSync, writeFileSync } from 'fs';
import * as gulp from 'gulp';
import { defer } from 'rxjs';
import { retry } from 'rxjs/operators';
const LOCO_API_KEY = '5WG7jjxuqda3vQaR6DZD39Y4yZBW-99Vf';
const LOCALES_PATH = `./src/assets/i18n`;
const LOCALES_TEMPLATE_PATH = `${LOCALES_PATH}/strings.po`;
const RETRY_NUMBER = 3; // Times to reconect to loco api if there is an error.

/**
 * Imports .json translation files from loco
 */
async function locoImportTask() {

  const apiKey = LOCO_API_KEY;
  const api = new LocoApi(apiKey);

  return defer(() => api.getLocales()).pipe(
    retry(RETRY_NUMBER))
    .subscribe((response: any) => {
      const locales = JSON.parse(response);

      if (locales && locales.length) {

        log(colors.blue('Importing translation files from Loco:'));
        locales.forEach((locale: any, index: number) => {
          // Receive the JSON of your locale.
          defer(() => api.exportLocale(locale.code)).pipe(
            retry(RETRY_NUMBER))
            .subscribe((value: any) => {
              try {
                log(colors.blue(locale.code + ' imported from Loco'));
                const localePath = LOCALES_PATH + '/' + locale.code + '.json';
                writeFileSync(localePath, value);
                log('Created translation file ', colors.yellow(localePath));
              } catch (error) {
                log(colors.red(`Error writing ${locale.code}.json file: ${error.message}`));
              }
            });
        });

      } else {
        log(colors.red('Error: No locales found in provided Loco project'));
      }
    }, (error) => {
      log(colors.red('Error:'), error.message);
    });
}

/**
 * Exports template.pot to localise.biz
 */
const locoExportTask = (done: any) => {

  const apiKey = LOCO_API_KEY;
  const api = new LocoApi(apiKey);
  const fileContents = readFileSync(LOCALES_TEMPLATE_PATH);

  return defer(() => api.importAsync(fileContents, 'pot')).pipe(
    retry(RETRY_NUMBER))
    .subscribe((response: any) => {
      log(colors.green('Locales template exported to Loco:'), response);
      done();
    }, (error) => {
      log(colors.red('Could not export locales template to Loco:'), error);
    });
};

// Localise.biz gulp tasks
gulp.task('export.loco', locoExportTask);
gulp.task('import.loco', locoImportTask);
