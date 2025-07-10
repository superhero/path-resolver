import fs     from 'node:fs/promises'
import module from 'node:module'
import path   from 'node:path'

export default class PathResolver
{
  /**
   * @type {string|undefined}
   */
  #basePath = path.dirname(process.argv[1])

  set basePath(value)
  {
    this.#basePath = value
  }

  get basePath()
  {
    return this.#basePath
  }

  /**
   * @param {string}    providedPath 
   * @param {function}  resolveFile callback
   * @param {function}  resolveDirectory callback
   */
  async resolve(providedPath, resolveFile, resolveDirectory)
  {
    try
    {
      const normalizedPath = this.#normalizePath(providedPath)

      if(path.isAbsolute(normalizedPath))
      {
        return await this.#resolveProvidedPath(normalizedPath, resolveFile, resolveDirectory)
      }

      if(providedPath === process.env.npm_package_name
      && process.env.npm_package_json)
      {
        const 
          packageJsonBuffer = await fs.readFile(process.env.npm_package_json),
          packageJson       = JSON.parse(packageJsonBuffer.toString()),
          packageDirname    = path.dirname(process.env.npm_package_json)

        if(packageJson.main)
        {
          return await resolveFile(path.join(packageDirname, packageJson.main))
        }

        if(packageJson.exports?.['.'])
        {
          return await resolveFile(path.join(packageDirname, packageJson.exports['.']))
        }

        return await resolveDirectory(packageDirname)
      }

      if(import.meta?.resolve)
      {
        const fileUrl = import.meta.resolve(providedPath, this.basePath)
        const resolvedFilePath = new URL(fileUrl).pathname
        return await resolveFile(resolvedFilePath)
      }
      else
      {
        const require = module.createRequire(this.basePath)
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

  #normalizePath(providedPath)
  {
    if('string' !== typeof providedPath)
    {
      const error = new TypeError('Provided path must be a string')
      error.code  = 'E_RESOLVE_PATH_INVALID_PROVIDED_PATH_TYPE'
      error.cause = new TypeError(`Invalid provided path type "${Object.prototype.toString.call(providedPath)}"`)
      throw error
    }

    if('string' === typeof this.basePath)
    {
      if(providedPath[0] === '.'
      &&(providedPath[1] === path.sep
      ||(providedPath[1] === '.'
      && providedPath[2] === path.sep)))
      {
        providedPath = path.join(this.basePath, providedPath)
      }
    }

    return providedPath
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