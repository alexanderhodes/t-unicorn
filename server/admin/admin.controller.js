/**
 * Created by vladimirdoroch on 04.01.17.
 */
import path from 'path';

/**
 * Liefere admin.html aus
 *
 * @param req {*}
 * @param res {*}
 */
export function index(req, res){
  res.sendFile(path.resolve('../dev/client/admin.html'));
}

/**
 * Liefere adminsettings.html aus
 *
 * @param req {*}
 * @param res {*}
 */
export function settings(req, res){
  res.sendFile(path.resolve('../dev/client/adminsettings.html'));
}
