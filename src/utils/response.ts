import { Response } from "express"

export function sendResponse(res: Response, result: any) {
  const status = result.status ?? 200
  const data = result.data ?? (result.token && result.refreshToken ? result : undefined)
  const error = result.error

  return res.status(status).json({ data, error })
}
