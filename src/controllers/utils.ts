import { Response } from 'express'

export const handleError = (err: Error, res: Response): Response => {
  if (err.name === 'ValidationError') {
    return res.status(400).json(err)
  } else {
    return res.status(500).json()
  }
}
