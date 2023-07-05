import sqlite3
import json
from flask import Flask, jsonify, request
from flask_cors import CORS


DATABASE = 'class/sistema_tramites.db'


def conectar():
    try:
        conn = sqlite3.connect(DATABASE, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        return conn
    except:
        return {'error': 'error db'}


app = Flask(__name__)
CORS(app)


def crear_tabla_tipo_tramites():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS tipo_tramites(
                    tipo_id INTEGER PRIMARY KEY,
                    tipo VARCHAR(255) NOT NULL,
                    descripcion VARCHAR(255) NOT NULL
        )''')
    conn.commit()
    cursor.close()
    conn.close()


def crear_tabla_estados_tramite():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS estados_tramite(
                    estado_id INTEGER PRIMARY KEY,
                    estado VARCHAR(255) NOT NULL,
                    descripcion VARCHAR(255) NOT NULL
        )''')
    conn.commit()
    cursor.close()
    conn.close()


def crear_tabla_puestos_trabajo():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS puestos_trabajo(
                    puesto_id INTEGER PRIMARY KEY,
                    puesto VARCHAR(255) NOT NULL,
                    descripcion VARCHAR(255) NOT NULL
        )''')
    conn.commit()
    cursor.close()
    conn.close()


def crear_tabla_tramites():
    conn = conectar()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS tramites(
                    tramite_id INTEGER PRIMARY KEY,
                    tipo_tramite_id INTEGER,
                    area_asignada_id INTEGER,
                    estado_id INTEGER,
                    propiedades nvarchar(4000),
                    finalizado NUMBER(1) NOT NULL,
                    motivo_finalizado nvarchar(4000),
                    FOREIGN KEY (tipo_tramite_id) REFERENCES tipo_tramites(id),
                    FOREIGN KEY (area_asignada_id) REFERENCES puestos_trabajo(id),
                    FOREIGN KEY (estado_id) REFERENCES estados_tramite(id)
        )''')
    conn.commit()
    cursor.close()
    conn.close()


# ----------------------------------------------------------------------------------
# Clases
class TiposTramites:
    def __init__(self):
        self.conexion = conectar()
        self.cursor = self.conexion.cursor()

    def nuevo_tipo(self, tipo, descripcion):
        self.cursor.execute(
            "SELECT * FROM tipo_tramites WHERE tipo = ?", (tipo,))
        tipo_existente = self.cursor.fetchone()
        if tipo_existente:
            return jsonify({'error': 'El tipo de trámite ingresado ya existe.'}), 400

        self.cursor.execute(
            "INSERT INTO tipo_tramites VALUES (?,?,?)", (None, tipo, descripcion))
        self.conexion.commit()
        return jsonify({'message': 'Tipo de trámite agregado exitosamente.'}), 200

    def listar_tipos(self):
        self.cursor.execute("SELECT * FROM tipo_tramites")
        rows = self.cursor.fetchall()
        tipos = []
        for row in rows:
            tipo_id, tipo, descripcion = row
            t = {'tipo_id': tipo_id, 'tipo': tipo, 'descripcion': descripcion}
            tipos.append(t)
        return jsonify(tipos), 200

    def consultar_tipo(self, tipo_id):
        self.cursor.execute(
            "SELECT * FROM tipo_tramites WHERE tipo_id = ?", (tipo_id,))
        row = self.cursor.fetchone()
        if row:
            tipo_id, tipo, descripcion = row
            return jsonify({'tipo_id': tipo_id, 'tipo': tipo, 'descripcion': descripcion}), 200
        return None

    def modificar_tipo(self, tipo_id, tipo, descripcion):
        tipo_tramite = self.consultar_tipo(tipo_id)

        if tipo_tramite:
            self.cursor.execute(
                "SELECT * FROM tipo_tramites WHERE tipo = ?", (tipo,))
            tipo_existente = self.cursor.fetchone()
            if tipo_existente:
                return jsonify({'error': 'El tipo de trámite ingresado ya existe.'}), 400

            self.cursor.execute("UPDATE tipo_tramites SET tipo = ?, descripcion = ? WHERE tipo_id = ?",
                                (tipo, descripcion, tipo_id))
            self.conexion.commit()
            return jsonify({'message': 'Tipo de trámite modificado correctamente.'}), 200
        return jsonify({'error': 'Tipo de trámite no encontrado.'}), 404

    def eliminar_tipo(self, tipo_id):
        self.cursor.execute(
            "DELETE FROM tipo_tramites WHERE tipo_id = ?", (tipo_id,))
        if self.cursor.rowcount > 0:
            self.conexion.commit()
            return jsonify({'message': 'Tipo de trámite eliminado correctamente.'}), 200
        return jsonify({'error': 'Tipo de trámite no encontrado.'}), 404


class PuestosTrabajo:
    def __init__(self):
        self.conexion = conectar()
        self.cursor = self.conexion.cursor()

    def nuevo_puesto(self, puesto, descripcion):
        self.cursor.execute(
            "SELECT * FROM puestos_trabajo WHERE puesto = ?", (puesto,))
        puesto_existente = self.cursor.fetchone()
        if puesto_existente:
            return jsonify({'error': 'El puesto de trabajo ya existe.'}), 400

        self.cursor.execute(
            "INSERT INTO puestos_trabajo VALUES (?,?,?)", (None, puesto, descripcion))
        self.conexion.commit()
        return jsonify({'message': 'Puesto de trabajo creado exitosamente.'}), 200

    def listar_puestos(self):
        self.cursor.execute("SELECT * FROM puestos_trabajo")
        rows = self.cursor.fetchall()
        puestos = []
        for row in rows:
            puesto_id, puesto, descripcion = row
            p = {'puesto_id': puesto_id, 'puesto': puesto,
                 'descripcion': descripcion}
            puestos.append(p)
        return jsonify(puestos), 200

    def consultar_puesto(self, puesto_id):
        self.cursor.execute(
            "SELECT * FROM puestos_trabajo WHERE puesto_id = ?", (puesto_id,))
        row = self.cursor.fetchone()
        if row:
            puesto_id, puesto, descripcion = row
            return jsonify({'puesto_id': puesto_id, 'puesto': puesto, 'descripcion': descripcion}), 200
        return None

    def modificar_puesto(self, puesto_id, puesto, descripcion):
        puesto_trabajo = self.consultar_puesto(puesto_id)

        if puesto_trabajo:
            self.cursor.execute(
                "SELECT * FROM puestos_trabajo WHERE puesto = ?", (puesto,))
            puesto_existente = self.cursor.fetchone()
            if puesto_existente:
                return jsonify({'error': 'Puesto de trabajo ya existe.'}), 400

            self.cursor.execute("UPDATE puestos_trabajo SET puesto = ?, descripcion = ? WHERE puesto_id = ?",
                                (puesto, descripcion, puesto_id))
            self.conexion.commit()
            return jsonify({'message': 'Puesto de trabajo modificado correctamente.'}), 200
        return jsonify({'error': 'Puesto de trabajo no encontrado.'}), 404

    def eliminar_puesto(self, puesto_id):
        self.cursor.execute(
            "DELETE FROM puestos_trabajo WHERE puesto_id = ?", (puesto_id,))
        if self.cursor.rowcount > 0:
            self.conexion.commit()
            return jsonify({'message': 'Puesto de trabajo eliminado correctamente.'}), 200
        return jsonify({'error': 'Puesto de trabajo no encontrado.'}), 404


class EstadosTramites:
    def __init__(self):
        self.conexion = conectar()
        self.cursor = self.conexion.cursor()

    def nuevo_estado(self, estado, descripcion):
        self.cursor.execute(
            "SELECT * FROM estados_tramite WHERE estado = ?", (estado,))
        estado_existente = self.cursor.fetchone()
        if estado_existente:
            return jsonify({'error': 'El estado ya existe.'}), 400

        self.cursor.execute(
            "INSERT INTO estados_tramite VALUES (?,?,?)", (None, estado, descripcion))
        self.conexion.commit()
        return jsonify({'message': 'Estado de trámite creado exitosamente.'}), 200

    def listar_estados(self):
        self.cursor.execute("SELECT * FROM estados_tramite")
        rows = self.cursor.fetchall()
        estados = []
        for row in rows:
            estado_id, estado, descripcion = row
            e = {'estado_id': estado_id, 'estado': estado,
                 'descripcion': descripcion}
            estados.append(e)
        return jsonify(estados), 200

    def consultar_estado(self, estado_id):
        self.cursor.execute(
            "SELECT * FROM estados_tramite WHERE estado_id = ?", (estado_id,))
        row = self.cursor.fetchone()
        if row:
            estado_id, estado, descripcion = row
            return jsonify({'estado_id': estado_id, 'estado': estado, 'descripcion': descripcion}), 200
        return None

    def modificar_estado(self, estado_id, estado, descripcion):
        estados = self.consultar_estado(estado_id)

        if estados:
            self.cursor.execute(
                "SELECT * FROM estados_tramite WHERE estado = ?", (estado,))
            estado_existente = self.cursor.fetchone()
            if estado_existente:
                return jsonify({'error': 'El estado ya existe.'}), 400

            self.cursor.execute("UPDATE estados_tramite SET estado = ?, descripcion = ? WHERE estado_id = ?", (estado, descripcion, estado_id))
            self.conexion.commit()
            return jsonify({'message': 'El estado fue modificado correctamente.'}), 200
        return jsonify({'error': 'Estado no encontrado.'}), 404

    def eliminar_estado(self, estado_id):
        self.cursor.execute(
            "DELETE FROM estados_tramite WHERE estado_id = ?", (estado_id,))
        if self.cursor.rowcount > 0:
            self.conexion.commit()
            return jsonify({'message': 'El estado fue eliminado correctamente.'}), 200
        return jsonify({'error': 'Estado no encontrado.'}), 404


class Tramites:
    def __init__(self):
        self.conexion = conectar()
        self.cursor = self.conexion.cursor()
        
    def listar_tramites(self):
        self.cursor.execute("SELECT tramites.*, tipo_tramites.tipo, puestos_trabajo.puesto, estados_tramite.estado FROM tramites INNER JOIN tipo_tramites ON tramites.tipo_tramite_id = tipo_tramites.tipo_id INNER JOIN puestos_trabajo ON tramites.area_asignada_id = puestos_trabajo.puesto_id INNER JOIN estados_tramite ON tramites.estado_id = estados_tramite.estado_id ")
        rows = self.cursor.fetchall()
        tramites = []
        for row in rows:
            tramite_id, tipo_tramite_id, area_asignada_id,estado_id,propiedades,finalizado,motivo_finalizado,tipo,puesto,estado = row
            t = {'tramite_id': tramite_id, 'tipo_tramite_id': tipo_tramite_id,'tipo':tipo,
                 'area_asignada_id': area_asignada_id,'puesto': puesto,'estado_id': estado_id, 'propiedades': propiedades,
                 'finalizado': finalizado,'motivo_finalizado': motivo_finalizado,'estado':estado}
            tramites.append(t)
        return jsonify(tramites), 200
    
    
    def propiedades(self):
        self.cursor.execute("SELECT * FROM tipo_tramites")
        rows = self.cursor.fetchall()
        tipos = []
        for row in rows:
            tipo_id, tipo, descripcion = row
            t = {'tipo_id': tipo_id, 'tipo': tipo, 'descripcion': descripcion}
            tipos.append(t)
        
        self.cursor.execute("SELECT * FROM puestos_trabajo")
        rows = self.cursor.fetchall()
        puestos = []
        for row in rows:
            puesto_id, puesto, descripcion = row
            p = {'puesto_id': puesto_id, 'puesto': puesto,
                 'descripcion': descripcion}
            puestos.append(p)
        
        coleccion = {'tipos':tipos,'puestos': puestos}
            
        return coleccion
        
       
    def nuevo_tramite(self, tipo_tramite_id, area_asignada_id,propiedades):
        self.cursor.execute(
            "INSERT INTO tramites VALUES (?,?,?,?,?,?,?)", (None, tipo_tramite_id, area_asignada_id,1,propiedades,0,None))
        self.conexion.commit()
        return jsonify({'message': 'Trámite creado exitosamente.'}), 200


    def consultar_tramite(self, tramite_id):
        self.cursor.execute(
            "SELECT tramites.*,estados_tramite.estado,puestos_trabajo.puesto FROM tramites INNER JOIN puestos_trabajo ON tramites.area_asignada_id = puestos_trabajo.puesto_id INNER JOIN estados_tramite ON tramites.estado_id = estados_tramite.estado_id WHERE tramite_id = ?", (tramite_id,))
        row = self.cursor.fetchone()
        if row:
            tramite_id,tipo_tramite_id, area_asignada_id, estado_id, propiedades,finalizado,motivo_finalizado,estado,puesto = row

            self.cursor.execute("SELECT estado_id as id_estado, estado as nombre_estado, descripcion as descripcion_estado FROM estados_tramite WHERE estado_id != 1")
            rows = self.cursor.fetchall()
            estados = []
            for row in rows:
                id_estado, nombre_estado, descripcion_estado = row
                e = {'estado_id': id_estado, 'estado': nombre_estado,
                 'descripcion': descripcion_estado}
                estados.append(e)
                
            prop = [{'tramite_id':tramite_id,'tipo_tramite_id': tipo_tramite_id, 'area_asignada_id': area_asignada_id, 'estado_id': estado_id,'estado':estado,'puesto':puesto ,'propiedades': propiedades,'estados':estados}]
            
            return jsonify(prop), 200
        return None


    def cambiar_estado_tramite(self, tramite_id, estado_id,motivo,descripcion):
        tramite = self.consultar_tramite(tramite_id)
        
        motivo_finalizacion = motivo +'-'+ descripcion
        print(motivo_finalizacion)
        if tramite:
            self.cursor.execute("UPDATE tramites SET estado_id = ?, finalizado = ?, motivo_finalizado = ? WHERE tramite_id = ?", (estado_id, 1,motivo_finalizacion,tramite_id))
            self.conexion.commit()
            return jsonify({'message': 'Trámite actualizado exitosamente.'}), 200
        return jsonify({'error': 'No se logró actualizar el trámite.'}), 404


    def eliminar_tramite(self, tramite_id):
        self.cursor.execute(
            "DELETE FROM tramites WHERE tramite_id = ?", (tramite_id,))
        if self.cursor.rowcount > 0:
            self.conexion.commit()
            return jsonify({'message': 'El tramite fue eliminado correctamente.'}), 200
        return jsonify({'error': 'Trámite no encontrado.'}), 404

# ----------------------------------------------------------------------------------
# Servidor
tipos = TiposTramites()
puestos = PuestosTrabajo()
estados = EstadosTramites()
tramites = Tramites()


# TIPO TRÁMITES
# HOME
@app.route('/tipos_tramites', methods=['GET'])
def obtener_tipos_tramites():
    return tipos.listar_tipos()


# CREAR TIPO
@app.route('/tipos_tramites', methods=['POST'])
def nuevo_tipo_tramite():
    tipo = request.json.get('tipo_tramite')
    descripcion = request.json.get('descripcion')
    return tipos.nuevo_tipo(tipo, descripcion)


# MODIFICAR TIPO
@app.route('/tipos_tramites/edit/<int:tipo_id>', methods=['GET'])
def obtener_tipo(tipo_id):
    tipo_tramite = tipos.consultar_tipo(tipo_id)
    if tipo_tramite:
        return tipo_tramite
    return jsonify({'message': 'Tipo de trámite no encontrado.'}), 404


@app.route('/tipos_tramites/edit/<int:tipo_id>', methods=['PATCH'])
def modificar_tipo(tipo_id):
    tipo = request.json.get('tipo_tramite')
    descripcion = request.json.get('descripcion')
    return tipos.modificar_tipo(tipo_id, tipo, descripcion)


# ELIMINAR TIPO
@app.route('/tipos_tramites/eliminar/<int:tipo_id>', methods=['DELETE'])
def delete_tipo(tipo_id):
    return tipos.eliminar_tipo(tipo_id)

# ----------------------------------------------------------------------------------
# PUESTOS DE TRABAJO
# HOME
@app.route('/puestos_trabajo', methods=['GET'])
def obtener_puestos_trabajo():
    return puestos.listar_puestos()


# CREAR PUESTO
@app.route('/puestos_trabajo', methods=['POST'])
def nuevo_puesto():
    puesto = request.json.get('puesto_trabajo')
    descripcion = request.json.get('descripcion')
    return puestos.nuevo_puesto(puesto, descripcion)


# MODIFICAR PUESTO
@app.route('/puestos_trabajo/edit/<int:puesto_id>', methods=['GET'])
def obtener_puesto(puesto_id):
    puesto_trabajo = puestos.consultar_puesto(puesto_id)
    if puesto_trabajo:
        return puesto_trabajo
    return jsonify({'message': 'Puesto de trabajo no encontrado.'}), 404


@app.route('/puestos_trabajo/edit/<int:puesto_id>', methods=['PATCH'])
def modificar_puesto(puesto_id):
    puesto = request.json.get('puesto_trabajo')
    descripcion = request.json.get('descripcion')
    return puestos.modificar_puesto(puesto_id, puesto, descripcion)


# ELIMINAR PUESTO
@app.route('/puestos_trabajo/eliminar/<int:puesto_id>', methods=['DELETE'])
def delete_puesto(puesto_id):
    return puestos.eliminar_puesto(puesto_id)

# ----------------------------------------------------------------------------------
# ESTADOS DEL TRÁMITE
# HOME
@app.route('/estados_tramite', methods=['GET'])
def obtener_estados_tramite():
    return estados.listar_estados()


# CREAR ESTADO
@app.route('/estados_tramite', methods=['POST'])
def nuevo_estado():
    estado = request.json.get('estado_tramite')
    descripcion = request.json.get('descripcion')
    return estados.nuevo_estado(estado, descripcion)


# MODIFICAR ESTADO
@app.route('/estados_tramite/edit/<int:estado_id>', methods=['GET'])
def obtener_estado(estado_id):
    estado_tramite = estados.consultar_estado(estado_id)
    if estado_tramite:
        return estado_tramite
    return jsonify({'message': 'Estado no encontrado.'}), 404


@app.route('/estados_tramite/edit/<int:estado_id>', methods=['PATCH'])
def modificar_estado(estado_id):
    estado = request.json.get('estado_tramite')
    descripcion = request.json.get('descripcion')
    return estados.modificar_estado(estado_id, estado, descripcion)


# ELIMINAR ESTADO
@app.route('/estados_tramite/eliminar/<int:estado_id>', methods=['DELETE'])
def delete_estado(estado_id):
    return estados.eliminar_estado(estado_id)


# ----------------------------------------------------------------------------------
# TRAMITES
# HOME
@app.route('/tramites', methods=['GET'])
def obtener_tramites():
    return tramites.listar_tramites()



# CREAR ESTADO
@app.route('/tramites/crear', methods=['GET'])
def obtener_propiedades():
    return tramites.propiedades()



@app.route('/tramites/crear', methods=['POST'])
def nuevo_tramite():
    tipo_tramite_id = request.json.get('tipo_tramite_id')
    area_asignada_id = request.json.get('area_asignada_id')
    propiedades = request.json.get('propiedades')
    return tramites.nuevo_tramite(tipo_tramite_id, area_asignada_id,propiedades)

# CAMBIO ESTADO
@app.route('/tramites/cambio_estado/<int:tramite_id>', methods=['GET'])
def traer_tramite(tramite_id):
    return tramites.consultar_tramite(tramite_id)

@app.route('/tramites/cambio_estado/<int:tramite_id>', methods=['POST'])
def cambio_estado_tramite(tramite_id):
    estado_id = request.json.get('estado')
    motivo = request.json.get('motivo')
    descripcion = request.json.get('descripcion')
    return tramites.cambiar_estado_tramite(tramite_id, estado_id,motivo,descripcion)


# ELIMINAR TRAMITE
@app.route('/tramites/eliminar/<int:tramite_id>', methods=['DELETE'])
def delete_tramite(tramite_id):
    return tramites.eliminar_tramite(tramite_id)

# ----------------------------------------------------------------------------------

@app.route('/', methods=['GET'])
def home():
    return 'Bienvenidos'


if __name__ == '__main__':
    crear_tabla_tipo_tramites()
    crear_tabla_estados_tramite()
    crear_tabla_puestos_trabajo()
    crear_tabla_tramites()
    app.run()
