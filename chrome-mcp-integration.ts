/**
 * Chrome MCP Server Integration for Augment Code
 * Provides wrapper functions to interact with Chrome MCP Server via HTTP API
 */

interface ChromeMCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface TabInfo {
  tabId: number;
  url: string;
  title: string;
  active: boolean;
}

interface WindowInfo {
  windowId: number;
  tabs: TabInfo[];
}

class ChromeMCPClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl = 'http://127.0.0.1:12306/mcp', timeout = 30000) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Check if Chrome MCP Server is running
   */
  async isServerRunning(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Execute a Chrome MCP tool
   */
  private async executeTool(toolName: string, params: any = {}): Promise<ChromeMCPResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/tools/${toolName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ==================== Browser Management ====================

  /**
   * Get all open windows and tabs
   */
  async getWindowsAndTabs(): Promise<{ windows: WindowInfo[]; windowCount: number; tabCount: number } | null> {
    const result = await this.executeTool('get_windows_and_tabs');
    return result.success ? result.data : null;
  }

  /**
   * Navigate to a URL
   */
  async navigate(url: string, newWindow = false, width = 1280, height = 720): Promise<boolean> {
    const result = await this.executeTool('chrome_navigate', {
      url,
      newWindow,
      width,
      height
    });
    return result.success;
  }

  /**
   * Close tabs or windows
   */
  async closeTabs(tabIds?: number[], windowIds?: number[]): Promise<boolean> {
    const result = await this.executeTool('chrome_close_tabs', {
      tabIds,
      windowIds
    });
    return result.success;
  }

  // ==================== Content Analysis ====================

  /**
   * Search content across browser tabs using semantic similarity
   */
  async searchTabsContent(query: string, limit = 10): Promise<any[] | null> {
    const result = await this.executeTool('search_tabs_content', {
      query,
      limit
    });
    return result.success ? result.data : null;
  }

  /**
   * Get web content from current or specific tab
   */
  async getWebContent(tabId?: number, format: 'text' | 'html' | 'markdown' = 'text'): Promise<string | null> {
    const result = await this.executeTool('chrome_get_web_content', {
      tabId,
      format
    });
    return result.success ? result.data : null;
  }

  /**
   * Get interactive elements from page
   */
  async getInteractiveElements(tabId?: number, selector?: string): Promise<any[] | null> {
    const result = await this.executeTool('chrome_get_interactive_elements', {
      tabId,
      selector
    });
    return result.success ? result.data : null;
  }

  // ==================== Screenshots ====================

  /**
   * Take screenshot of page or element
   */
  async takeScreenshot(options: {
    tabId?: number;
    selector?: string;
    fullPage?: boolean;
    format?: 'png' | 'jpeg';
    quality?: number;
  } = {}): Promise<string | null> {
    const result = await this.executeTool('chrome_screenshot', options);
    return result.success ? result.data : null;
  }

  // ==================== Interaction ====================

  /**
   * Click an element
   */
  async clickElement(selector: string, tabId?: number): Promise<boolean> {
    const result = await this.executeTool('chrome_click_element', {
      selector,
      tabId
    });
    return result.success;
  }

  /**
   * Fill form or select option
   */
  async fillOrSelect(selector: string, value: string, tabId?: number): Promise<boolean> {
    const result = await this.executeTool('chrome_fill_or_select', {
      selector,
      value,
      tabId
    });
    return result.success;
  }

  /**
   * Send keyboard input
   */
  async sendKeyboard(keys: string, tabId?: number): Promise<boolean> {
    const result = await this.executeTool('chrome_keyboard', {
      keys,
      tabId
    });
    return result.success;
  }

  // ==================== Network Monitoring ====================

  /**
   * Start network capture
   */
  async startNetworkCapture(tabId?: number): Promise<boolean> {
    const result = await this.executeTool('chrome_network_capture_start', { tabId });
    return result.success;
  }

  /**
   * Stop network capture and get results
   */
  async stopNetworkCapture(tabId?: number): Promise<any[] | null> {
    const result = await this.executeTool('chrome_network_capture_stop', { tabId });
    return result.success ? result.data : null;
  }

  // ==================== Data Management ====================

  /**
   * Search browser history
   */
  async searchHistory(query: string, maxResults = 100): Promise<any[] | null> {
    const result = await this.executeTool('chrome_history', {
      query,
      maxResults
    });
    return result.success ? result.data : null;
  }

  /**
   * Search bookmarks
   */
  async searchBookmarks(query: string): Promise<any[] | null> {
    const result = await this.executeTool('chrome_bookmark_search', { query });
    return result.success ? result.data : null;
  }

  /**
   * Add bookmark
   */
  async addBookmark(url: string, title: string, folder?: string): Promise<boolean> {
    const result = await this.executeTool('chrome_bookmark_add', {
      url,
      title,
      folder
    });
    return result.success;
  }
}

// Export singleton instance
export const chromeMCP = new ChromeMCPClient();

// Helper functions for common use cases
export async function quickWebSearch(query: string): Promise<string> {
  const searchResults = await chromeMCP.searchTabsContent(query);
  if (!searchResults || searchResults.length === 0) {
    return "No relevant content found in open browser tabs.";
  }

  return searchResults
    .slice(0, 3)
    .map((result, index) => 
      `${index + 1}. ${result.title}\n   ${result.content.substring(0, 200)}...`
    )
    .join('\n\n');
}

export async function captureCurrentPage(): Promise<string> {
  const screenshot = await chromeMCP.takeScreenshot({ fullPage: true });
  if (!screenshot) {
    throw new Error("Failed to capture screenshot");
  }
  return screenshot;
}

export async function automateWebTask(steps: Array<{
  action: 'navigate' | 'click' | 'fill' | 'wait';
  target?: string;
  value?: string;
  url?: string;
}>) {
  for (const step of steps) {
    switch (step.action) {
      case 'navigate':
        if (step.url) {
          await chromeMCP.navigate(step.url);
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for page load
        }
        break;
      case 'click':
        if (step.target) {
          await chromeMCP.clickElement(step.target);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        break;
      case 'fill':
        if (step.target && step.value) {
          await chromeMCP.fillOrSelect(step.target, step.value);
        }
        break;
      case 'wait':
        await new Promise(resolve => setTimeout(resolve, 2000));
        break;
    }
  }
}
