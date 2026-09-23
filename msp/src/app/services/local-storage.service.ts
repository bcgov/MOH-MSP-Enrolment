import { Injectable } from '@angular/core';

/**
 * Replacement for `angular-2-local-storage`, which was never rebuilt past a
 * View Engine (ngc/metadata.json) package and cannot be consumed by Ivy - the
 * Angular 19 compiler has no ngcc fallback for it. This mirrors the subset of
 * its LocalStorageService API msp actually uses (get/set/clearAll, prefixed
 * sessionStorage) with the config msp always passed: prefix 'ca.bc.gov.msp',
 * storageType 'sessionStorage'.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly prefix = 'ca.bc.gov.msp.';
  // Reading window.sessionStorage can itself throw SecurityError (browser
  // storage blocked, sandboxed iframe without allow-same-origin), so guard
  // the read - this field initialiser runs inside the DI factory, and an
  // uncaught throw here fails the whole app's bootstrap.
  private readonly webStorage: Storage = this.getWebStorage();

  private getWebStorage(): Storage {
    try {
      return window.sessionStorage;
    } catch {
      return null;
    }
  }

  private deriveKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  get<T>(key: string): T {
    if (!this.webStorage) {
      return null;
    }
    const item = this.webStorage.getItem(this.deriveKey(key));
    if (!item || item === 'null') {
      return null;
    }
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  }

  set(key: string, value: any): boolean {
    if (!this.webStorage) {
      return false;
    }
    try {
      this.webStorage.setItem(
        this.deriveKey(key),
        value === undefined ? null : JSON.stringify(value)
      );
      return true;
    } catch {
      return false;
    }
  }

  clearAll(): boolean {
    if (!this.webStorage) {
      return false;
    }
    Object.keys(this.webStorage)
      .filter(key => key.indexOf(this.prefix) === 0)
      .forEach(key => this.webStorage.removeItem(key));
    return true;
  }
}
