# Reminders

An application that brings your digital reminders into the physical world. Create scheduled reminders that are printed out on a thermal receipt printer.

## Docker Setup

Simple Setup
``` bash
docker run \
  -v "$(pwd)/logs":"/usr/src/app/logs":"rw" \
  -v "$(pwd)/database":"/usr/src/database":"rw" \ 
  -v "$(pwd)/uploads":"/usr/src/app/uploads":"rw" \
  -e "AI_GATEWAY_API_KEY"="" \
  -e "PRINTER_IP"="" \
  -p "3000:3000/tcp" \
  josiahsayers15/reminders
```

### Volume Mounts

- **/usr/src/app/logs** - Application access and error logs
- **/usr/src/database** - Storage location for the sqlite database holding all application data
- **/usr/src/app/uploads** - Storage location for uploaded images

### Environment Variables

- **AI_GATEWAY_API_KEY - OPTIONAL** - Used to enable AI generation of CRON strings from plain text descriptions
  - This key can be generated here: https://vercel.com/ai-gateway
- **PRINTER_IP** - IP Address of your thermal printer
