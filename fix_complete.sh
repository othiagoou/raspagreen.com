#!/bin/bash

# Script completo para corrigir todas as URLs problemáticas
JS_FILE="/mnt/c/Users/pctes/Downloads/raspagreen.com/raspagreen.com/assets/index-i32zO904.js"

echo "🔧 Iniciando correção completa de URLs..."

# Backup
cp "$JS_FILE" "${JS_FILE}.backup2"

# Substituir a URL hardcoded do backend para usar URLs relativas
sed -i 's|https://raspagreen-backend\.onrender\.com/api|/api|g' "$JS_FILE"

# Corrigir outras concatenações problemáticas que podem estar gerando /run, /cdn-cgi etc
sed -i 's|\/\.netlify\/functions\/run\/api\/|\/api\/|g' "$JS_FILE"
sed -i 's|\/cdn-cgi\/run\/api\/|\/api\/|g' "$JS_FILE"
sed -i 's|\/cdn-cgi\/run\/|\/api\/|g' "$JS_FILE"
sed -i 's|\.netlify\/functions\/run\/api\/|\/api\/|g' "$JS_FILE"
sed -i 's|cdn-cgi\/run\/api\/|\/api\/|g' "$JS_FILE"
sed -i 's|cdn-cgi\/run\/|\/api\/|g' "$JS_FILE"
sed -i 's|netlify\/functions\/run|\/api|g' "$JS_FILE"

# Corrigir possíveis concatenações de base URL + path
sed -i 's|"/run/api"|"/api"|g' "$JS_FILE"
sed -i 's|"run/api"|"/api"|g' "$JS_FILE" 
sed -i 's|\/run\/api\/|\/api\/|g' "$JS_FILE"
sed -i 's|"run\/"|"/api/"|g' "$JS_FILE"

# Corrigir concatenações dinâmicas que podem gerar URLs erradas
sed -i 's|`\${[^}]*}\/run\/api`|"/api"|g' "$JS_FILE"
sed -i 's|`\${[^}]*}\/run`|"/api"|g' "$JS_FILE"
sed -i 's|+[^+]*+"\/run\/api"|"/api"|g' "$JS_FILE"
sed -i 's|+[^+]*+"\/run"|"/api"|g' "$JS_FILE"

echo "✅ Correções aplicadas!"

# Verificar resultados
echo "🔍 Verificando correções..."

problemas=0

if grep -q "cdn-cgi" "$JS_FILE"; then
    echo "❌ Ainda existem referências a 'cdn-cgi'"
    problemas=$((problemas + 1))
fi

if grep -q "netlify/functions/run" "$JS_FILE"; then
    echo "❌ Ainda existem referências a 'netlify/functions/run'"
    problemas=$((problemas + 1))
fi

if grep -q "raspagreen-backend.onrender.com" "$JS_FILE"; then
    echo "❌ Ainda existem referências ao backend hardcoded"
    problemas=$((problemas + 1))
fi

if grep -q "/run/api" "$JS_FILE"; then
    echo "❌ Ainda existem referências a '/run/api'"
    problemas=$((problemas + 1))
fi

if [ $problemas -eq 0 ]; then
    echo "✅ Todas as URLs problemáticas foram corrigidas!"
else
    echo "⚠️  Ainda existem $problemas tipos de problemas"
fi

# Contar APIs corretas
api_count=$(grep -o "/api/" "$JS_FILE" | wc -l)
echo "✅ Encontradas $api_count referências a /api/"

echo "🎉 Correção concluída!"