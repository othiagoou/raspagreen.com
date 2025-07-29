#!/bin/bash

# Script para corrigir URLs problemáticas no JavaScript compilado
JS_FILE="/mnt/c/Users/pctes/Downloads/raspagreen.com/raspagreen.com/assets/index-i32zO904.js"

echo "Iniciando correção de URLs..."

# Backup
cp "$JS_FILE" "${JS_FILE}.backup"

# Corrigir concatenações problemáticas específicas
sed -i 's/\/\.netlify\/functions\/run\/api\//\/api\//g' "$JS_FILE"
sed -i 's/\/cdn-cgi\/run\/api\//\/api\//g' "$JS_FILE"
sed -i 's/\/cdn-cgi\/run\//\/api\//g' "$JS_FILE"
sed -i 's/\.netlify\/functions\/run\/api\//\/api\//g' "$JS_FILE"
sed -i 's/cdn-cgi\/run\/api\//\/api\//g' "$JS_FILE"
sed -i 's/cdn-cgi\/run\//\/api\//g' "$JS_FILE"

# Corrigir concatenações de URL base + path
sed -i 's/,e\.concat("\/api")/,"\/api"/g' "$JS_FILE"
sed -i 's/+e+"\/api"/"\/api"/g' "$JS_FILE" 
sed -i 's/\${e}\/api/\/api/g' "$JS_FILE"
sed -i 's/`\${[^}]*}\/api`/"\/api"/g' "$JS_FILE"

# Corrigir outras concatenações problemáticas
sed -i 's/"\/run\/api"/"\/api"/g' "$JS_FILE"
sed -i 's/"run\/api"/"\/api"/g' "$JS_FILE"
sed -i 's/\/run\/api\//\/api\//g' "$JS_FILE"

echo "Correções aplicadas!"
echo "Verificando resultado..."

# Verificar se há problemas restantes
if grep -q "cdn-cgi\|netlify/functions/run\|/run/api" "$JS_FILE"; then
    echo "AVISO: Ainda existem referências problemáticas:"
    grep -o "cdn-cgi\|netlify/functions/run\|/run/api" "$JS_FILE" | sort | uniq -c
else
    echo "✅ Nenhuma referência problemática encontrada"
fi

# Contar APIs corretas
api_count=$(grep -o "/api/" "$JS_FILE" | wc -l)
echo "✅ Encontradas $api_count referências a /api/"

echo "Correção concluída!"