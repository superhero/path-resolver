import fs     from 'node:fs/promises'
import module from 'node:module'
import path   from 'node:path'

const require = module.createRequire(import.meta.url)

export default class PathResolver
{
  /**
   * @param {string}    providedPath 
   * @param {function}  resolveFile callback
   * @param {function}  resolveDirectory callback
   */
  async resolve(providedPath, resolveFile, resolveDirectory)
  {
    try
    {
      if(path.isAbsolute(providedPath))
      {
        return await this.#resolveProvidedPath(providedPath, resolveFile, resolveDirectory)
      }
      else
      {
        const resolvedFilePath = require.resolve(providedPath)
        return await resolveFile(resolvedFilePath)
      }
    }
    catch(reason)
    {
      const error = new Error(`Could not resolve path "${providedPath}"`)
      error.code  = 'E_RESOLVE_PATH'
      error.cause = reason
      throw error
    }
  }

  async #resolveProvidedPath(providedPath, resolveFile, resolveDirectory)
  {
    const stats = await fs.lstat(providedPath)

    if(stats.isSymbolicLink())
    {
      const symbolicLinkPath = await fs.realpath(providedPath)
      return await this.#resolveProvidedPath(symbolicLinkPath, resolveFile, resolveDirectory)
    }

    if(stats.isFile())
    {
      return await resolveFile(providedPath)
    }

    if(stats.isDirectory()) 
    {
      return await resolveDirectory(providedPath)
    }

    const error = new TypeError('Unknown path type')
    error.code  = 'E_RESOLVE_PATH_UNKNOWN_TYPE'
    throw error
  }
}