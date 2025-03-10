import { fileURLToPath } from "url";
import { Command } from 'commander';
import { format } from 'date-fns';

class RhyVer {
  /**
   * Get current year and quarter in RhyVer format
   * @returns {string} Current year and quarter (e.g., '24Q4')
   */
  static getCurrentYearQuarter(): string {
    const now = new Date();
    const year = format(now, 'yy');
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `${year}Q${quarter}`;
  }

  /**
   * Get current ISO week number
   * @returns {number} Current ISO week number
   */
  static getCurrentISOWeek(): number {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  }

  /**
   * Validate a RhyVer version string
   * @param {string} version - Version string to validate
   * @returns {boolean} Whether the version is valid
   */
  static validateVersion(version: string): boolean {
    const pattern = /^v(0|[1-9]\d*)\.(2\d)Q([1-4])\.((?:[1-9]|[1-4]\d|5[0-3]))\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    return pattern.test(version);
  }

  /**
   * Generate a RhyVer version string
   * @param {Object} options - Version generation options
   * @returns {string} Generated RhyVer version
   */
  static generateVersion(options: {
    major?: number;
    yearQuarter?: string;
    week?: number;
    story?: number;
    prerelease?: string;
    build?: string;
  } = {}): string {
    const {
      major = 1,
      yearQuarter = this.getCurrentYearQuarter(),
      week = this.getCurrentISOWeek(),
      story = 0,
      prerelease,
      build
    } = options;

    let version = `v${major}.${yearQuarter}.${week}.${story}`;

    if (prerelease) {
      version += `-${prerelease}`;
    }

    if (build) {
      version += `+${build}`;
    }

    return version;
  }

  /**
   * Convert RhyVer version to npm-compatible semantic versioning
   * @param {string} rhyverVersion - RhyVer version string
   * @returns {string} npm-compatible version
   */
  static convertToNpm(rhyverVersion: string): string {
    if (!this.validateVersion(rhyverVersion)) {
      throw new Error(`Invalid RhyVer version: ${rhyverVersion}`);
    }

    const pattern = /^v(\d+)\.(\d+)Q\d+\.(\d+)\.(\d+)(-[^+]*)?(\+.*)?$/;
    const match = rhyverVersion.match(pattern);

    if (!match) {
      throw new Error(`Cannot parse RhyVer version: ${rhyverVersion}`);
    }

    const [, major, year, week, story, prerelease = '', build = ''] = match;
    let npmVersion = `${major}.${week}.${story}`;
    
    if (prerelease) {
      npmVersion += prerelease;
    }
    
    if (build) {
      npmVersion += build;
    }

    return npmVersion;
  }
}

function createCli() {
  const program = new Command();

  program
    .name('rhyver')
    .description('RhyVer versioning CLI tool')
    .version('1.0.0');

  program
    .command('generate')
    .description('Generate a RhyVer version')
    .option('-m, --major <number>', 'Major version number', '1')
    .option('-yq, --year-quarter <string>', 'Year and quarter (e.g., 24Q4)', RhyVer.getCurrentYearQuarter())
    .option('-w, --week <number>', 'ISO week number', String(RhyVer.getCurrentISOWeek()))
    .option('-s, --story <number>', 'Story number', '0')
    .option('-p, --prerelease <string>', 'Prerelease tag')
    .option('-b, --build <string>', 'Build metadata')
    .action((options) => {
      try {
        const version = RhyVer.generateVersion({
          major: parseInt(options.major, 10),
          yearQuarter: options.yearQuarter,
          week: parseInt(options.week, 10),
          story: parseInt(options.story, 10),
          prerelease: options.prerelease,
          build: options.build
        });
        console.log(version);
      } catch (error) {
        console.error('Error generating version:', error);
        process.exit(1);
      }
    });

  program
    .command('validate <version>')
    .description('Validate a RhyVer version')
    .action((version) => {
      const isValid = RhyVer.validateVersion(version);
      console.log(isValid ? 'Valid' : 'Invalid');
    });

  program
    .command('convert <version>')
    .description('Convert RhyVer version to npm version')
    .action((version) => {
      try {
        const npmVersion = RhyVer.convertToNpm(version);
        console.log(npmVersion);
      } catch (error) {
        console.error('Error converting version:', error);
        process.exit(1);
      }
    });

  return program;
}

export function run() {
  const program = createCli();
  program.parse(process.argv);
}

const isDirectlyExecuted = (() => {
  try {
    const currentFilePath = fileURLToPath(import.meta.url);
    return process.argv[1] === currentFilePath;
  } catch {
    return require.main === module;
  }
})();

if (isDirectlyExecuted) {
  run();
}

export default RhyVer;